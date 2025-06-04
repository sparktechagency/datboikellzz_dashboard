import React, { useState, useEffect } from 'react';
import { CheckIcon, PlusIcon, XMarkIcon, PencilIcon } from './icons.jsx';
import toast from 'react-hot-toast';
import { CiWarning } from 'react-icons/ci';
import {
  useGetAllSubscriptionQuery,
  useUpdateSubscriptionMutation,
} from '../../../Redux/services/dashboard apis/subscription/subscriptionApis.js';

export default function SubscriptionManagement() {
  const { data: subscriptionData, isLoading: subscriptionDataLoading } =
    useGetAllSubscriptionQuery();

  const [updateSubscription, { isLoading: isUpdating }] =
    useUpdateSubscriptionMutation();

  // Add duration switcher state
  const [selectedDuration, setSelectedDuration] = useState('daily');
  const [selectedPlan, setSelectedPlan] = useState('quick_hit');
  const [plans, setPlans] = useState({});
  const [availablePlanTypes, setAvailablePlanTypes] = useState({
    daily: [],
    monthly: [],
  });

  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
  const [isFeatureModalOpen, setIsFeatureModalOpen] = useState(false);

  const [newPrice, setNewPrice] = useState('');
  const [newPeriod, setNewPeriod] = useState('');
  const [newFeature, setNewFeature] = useState('');
  const [tempFeatures, setTempFeatures] = useState([]);

  useEffect(() => {
    if (subscriptionData?.data?.subscriptionPlans) {
      const apiPlans = subscriptionData.data.subscriptionPlans;

      const plansByTypeAndDuration = {
        daily: {},
        monthly: {},
      };

      apiPlans.forEach((plan) => {
        const type = plan.subscriptionType.toLowerCase();
        const duration = plan.duration === 'daily' ? 'daily' : 'monthly';

        if (
          !plansByTypeAndDuration[duration][type] ||
          new Date(plan.updatedAt) >
            new Date(plansByTypeAndDuration[duration][type].updatedAt)
        ) {
          plansByTypeAndDuration[duration][type] = plan;
        }
      });

      const transformedPlans = {};
      const planTypes = {
        daily: [],
        monthly: [],
      };

      // Process daily and monthly plans
      ['daily', 'monthly'].forEach((duration) => {
        Object.entries(plansByTypeAndDuration[duration]).forEach(
          ([type, plan]) => {
            const planKey = `${duration}_${type}`;
            planTypes[duration].push(type);

            transformedPlans[planKey] = {
              id: plan._id,
              name: type,
              duration: duration,
              displayName: `${type
                .split('_')
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')} Plan`,
              price: plan.price.toString(),
              period: plan.duration === 'monthly' ? 'month' : plan.duration,
              features: plan.features.map((feature, index) => ({
                id: index + 1,
                text: feature,
              })),
              createdAt: plan.createdAt,
              updatedAt: plan.updatedAt,
            };
          }
        );
      });

      setPlans(transformedPlans);
      setAvailablePlanTypes(planTypes);

      // Set default selected plan based on available plans
      const currentDurationPlans = planTypes[selectedDuration];
      if (currentDurationPlans.length > 0) {
        const currentPlanExists = currentDurationPlans.includes(
          selectedPlan.replace(`${selectedDuration}_`, '')
        );
        if (!currentPlanExists) {
          setSelectedPlan(currentDurationPlans[0]);
        }
      }
    }
  }, [subscriptionData, selectedDuration]);

  useEffect(() => {
    const currentPlanKey = `${selectedDuration}_${selectedPlan}`;
    if (plans[currentPlanKey]) {
      setNewPrice(plans[currentPlanKey].price);
      setNewPeriod(plans[currentPlanKey].period);
    }
  }, [selectedPlan, selectedDuration, plans]);

  const getCurrentPlanKey = () => `${selectedDuration}_${selectedPlan}`;
  const getCurrentPlan = () => plans[getCurrentPlanKey()];

  const handleDurationChange = (duration) => {
    setSelectedDuration(duration);
    const availablePlans = availablePlanTypes[duration];
    if (availablePlans.length > 0) {
      setSelectedPlan(availablePlans[0]);
    }
  };

  const handleOpenPriceModal = () => {
    const currentPlan = getCurrentPlan();
    if (currentPlan) {
      setNewPrice(currentPlan.price);
      setNewPeriod(currentPlan.period);
      setIsPriceModalOpen(true);
    }
  };

  const handleSavePrice = async () => {
    try {
      const currentPlan = getCurrentPlan();
      const updateData = {
        subscriptionPlanId: currentPlan.id,
        price: parseFloat(newPrice),
        features: currentPlan.features.map((f) => f.text),
      };

      const res = await updateSubscription({ data: updateData }).unwrap();
      if (res?.success) {
        toast.success(
          res?.message || 'Subscription price updated successfully!'
        );
        const currentPlanKey = getCurrentPlanKey();
        const updatedPlans = {
          ...plans,
          [currentPlanKey]: {
            ...plans[currentPlanKey],
            price: newPrice,
            period: newPeriod,
          },
        };

        setPlans(updatedPlans);
        setIsPriceModalOpen(false);
      }
    } catch (error) {
      console.error('Error updating subscription price:', error);
      toast.error('Failed to update subscription price. Please try again.');
    }
  };

  const handleOpenFeatureModal = () => {
    const currentPlan = getCurrentPlan();
    if (currentPlan) {
      setTempFeatures([...currentPlan.features]);
      setIsFeatureModalOpen(true);
    }
  };

  const handleAddFeature = () => {
    if (newFeature.trim() === '')
      return toast.error('please add a valid feature');
    if (tempFeatures.length >= 6) {
      return toast.error('Feature limit reached.');
    }
    const newId =
      tempFeatures.length > 0
        ? Math.max(...tempFeatures.map((f) => f.id)) + 1
        : 1;

    setTempFeatures([...tempFeatures, { id: newId, text: newFeature }]);
    setNewFeature('');
  };

  const handleRemoveFeature = (id) => {
    setTempFeatures(tempFeatures.filter((feature) => feature.id !== id));
  };

  async function handleSaveFeatures() {
    try {
      const currentPlan = getCurrentPlan();
      const updateData = {
        subscriptionPlanId: currentPlan.id,
        features: tempFeatures.map((f) => f.text),
        price: parseFloat(currentPlan.price),
      };

      await updateSubscription({ data: updateData }).unwrap();

      const currentPlanKey = getCurrentPlanKey();
      const updatedPlans = {
        ...plans,
        [currentPlanKey]: {
          ...plans[currentPlanKey],
          features: [...tempFeatures],
        },
      };

      setPlans(updatedPlans);
      setIsFeatureModalOpen(false);
      toast.success('Subscription features updated successfully!');
    } catch (error) {
      console.error('Error updating subscription features:', error);
      toast.error('Failed to update subscription features. Please try again.');
    }
  }

  if (subscriptionDataLoading) {
    return (
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Subscription Management</h1>
          <p className="text-gray-500 mt-2">Loading subscription plans...</p>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#022C22]"></div>
        </div>
      </div>
    );
  }

  if (
    !subscriptionData?.data?.subscriptionPlans ||
    (availablePlanTypes.daily.length === 0 &&
      availablePlanTypes.monthly.length === 0)
  ) {
    return (
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Subscription Management</h1>
          <p className="text-gray-500 mt-2">No subscription plans found</p>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-500">
            No subscription plans available to manage.
          </p>
        </div>
      </div>
    );
  }

  const currentDurationPlans = availablePlanTypes[selectedDuration];
  const currentPlan = getCurrentPlan();

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Subscription Management</h1>
        <p className="text-gray-500 mt-2">
          Manage your subscription plans, pricing, and features
        </p>
      </div>

      <div className="w-full">
        {/* Duration Switcher */}
        <div className="grid grid-cols-2 mb-6 border rounded-md overflow-hidden">
          <button
            onClick={() => handleDurationChange('daily')}
            className={`py-3 px-4 text-center transition-colors ${
              selectedDuration === 'daily'
                ? 'bg-[#022C22] !text-white'
                : 'bg-white hover:bg-gray-50'
            } cursor-pointer`}
          >
            Daily Plans
          </button>
          <button
            onClick={() => handleDurationChange('monthly')}
            className={`py-3 px-4 text-center transition-colors ${
              selectedDuration === 'monthly'
                ? 'bg-[#022C22] !text-white'
                : 'bg-white hover:bg-gray-50'
            } cursor-pointer`}
          >
            Monthly Plans
          </button>
        </div>

        {/* Plan Type Switcher */}
        {Array.isArray(currentDurationPlans) &&
          currentDurationPlans.length > 0 && (
            <div
              className={`!grid ${
                currentDurationPlans?.length === 3
                  ? 'grid-cols-3'
                  : currentDurationPlans?.length === 2
                  ? 'grid-cols-2'
                  : 'grid-cols-1'
              } mb-8 border rounded-md overflow-hidden`}
            >
              {currentDurationPlans.map((planKey) => (
                <button
                  key={planKey}
                  onClick={() => setSelectedPlan(planKey)}
                  className={`py-3 px-4 text-center transition-colors ${
                    selectedPlan === planKey
                      ? 'bg-[#022C22] !text-white'
                      : 'bg-white hover:bg-gray-50'
                  } cursor-pointer`}
                >
                  {planKey
                    .split('_')
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ')}
                </button>
              ))}
            </div>
          )}

        {/* Show message if no plans available for selected duration */}
        {currentDurationPlans.length === 0 && (
          <div className="text-center py-8 border rounded-lg">
            <p className="text-gray-500">
              No {selectedDuration} plans available yet.
            </p>
          </div>
        )}

        {/* Plan Content */}
        {currentDurationPlans.map((planKey) => (
          <div
            key={planKey}
            className={`mt-0 ${selectedPlan !== planKey ? 'hidden' : ''}`}
          >
            {currentPlan && (
              <div className="border-2 rounded-lg shadow-sm">
                <div className="p-6 border-b">
                  <div>
                    <div className="flex justify-between items-center">
                      <div>
                        <h2 className="text-2xl font-bold">
                          {currentPlan.displayName}
                        </h2>
                        <p className="text-gray-500">
                          {selectedDuration.charAt(0).toUpperCase() +
                            selectedDuration.slice(1)}{' '}
                          subscription details and features
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Last updated:{' '}
                          {new Date(currentPlan.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleOpenPriceModal}
                          className="bg-[#022C22] hover:bg-[#033c2e] cursor-pointer !text-white px-4 py-2 rounded-md flex items-center"
                        >
                          <PencilIcon className="mr-2 h-4 w-4" />
                          Update Price
                        </button>
                      </div>
                    </div>
                    <div className="mb-6">
                      <span className="text-[#022C22] text-4xl font-bold">
                        $ {currentPlan.price}
                      </span>
                      <span className="text-gray-500 ml-1">
                        /{currentPlan.period}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h3 className="text-2xl font-bold">Features</h3>
                      <button
                        onClick={handleOpenFeatureModal}
                        className="border border-[#022C22] text-[#022C22] cursor-pointer hover:bg-[#022C22] hover:!text-white px-4 py-2 rounded-md flex items-center"
                      >
                        <PencilIcon className="mr-2 h-4 w-4" />
                        Manage Features
                      </button>
                    </div>

                    <ul className="space-y-3 mt-4">
                      {currentPlan.features.map((feature) => (
                        <li
                          key={feature.id}
                          className="flex items-center gap-2"
                        >
                          <div className="flex-shrink-0 h-5 w-5 rounded-full bg-transparent border-1 border-[#022C22] flex items-center justify-center">
                            <CheckIcon className="h-3 w-3 text-[#022C22]" />
                          </div>
                          <span>{feature.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Price Modal */}
      {isPriceModalOpen && currentPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="mb-4">
              <h2 className="text-xl font-bold">Update Subscription Price</h2>
              <p className="text-gray-500">
                Update the price and billing period for the{' '}
                {currentPlan.displayName}.
              </p>
            </div>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label
                  htmlFor="plan-type"
                  className="block text-sm font-medium"
                >
                  Plan Type
                </label>
                <select
                  id="plan-type"
                  value={selectedPlan}
                  onChange={(e) => setSelectedPlan(e.target.value)}
                  className="w-full border rounded-md p-2"
                >
                  {currentDurationPlans.map((type) => (
                    <option key={type} value={type}>
                      {type
                        .split('_')
                        .map(
                          (word) => word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(' ')}{' '}
                      Plan
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="price" className="block text-sm font-medium">
                  Price ($)
                </label>
                <input
                  id="price"
                  type="number"
                  step="0.01"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="w-full border rounded-md p-2"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="period" className="block text-sm font-medium">
                  Billing Period
                </label>
                <select
                  id="period"
                  value={newPeriod}
                  onChange={(e) => setNewPeriod(e.target.value)}
                  className="w-full border rounded-md p-2"
                >
                  <option value="daily">Daily</option>
                  <option value="month">Monthly</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setIsPriceModalOpen(false)}
                className="border-red-200 bg-red-50 cursor-pointer text-red-500 hover:bg-red-100 hover:text-red-600 py-2 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePrice}
                disabled={isUpdating}
                className="bg-[#022C22] hover:bg-[#033c2e] cursor-pointer !text-white py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isUpdating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feature Modal */}
      {isFeatureModalOpen && currentPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="mb-4">
              <h2 className="text-xl font-bold">Manage Features</h2>
              <p className="text-gray-500">
                Add, edit, or remove features for the {currentPlan.displayName}.
              </p>
              <p className="p-1 flex items-center animate-pulse gap-1 bg-yellow-100 rounded-md text-xs">
                <CiWarning size={18} />
                Please add the feature and save it.
              </p>
            </div>

            <div className="py-4">
              <div className="flex items-center space-x-2 gap-2 mb-4">
                <input
                  placeholder="Add a new feature..."
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  className="flex-1 border rounded-md p-2"
                />
                <button
                  onClick={handleAddFeature}
                  className="bg-[#022C22] hover:bg-[#033c2e] cursor-pointer !text-white p-2 rounded-md"
                >
                  <PlusIcon className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                {tempFeatures.map((feature) => (
                  <div
                    key={feature.id}
                    className={`flex items-center justify-between p-3 border rounded-md ${
                      !currentPlan.features.some((f) => f.id === feature.id)
                        ? 'bg-green-50 border-green-200'
                        : ''
                    }`}
                  >
                    <span>{feature.text}</span>
                    <button
                      onClick={() => handleRemoveFeature(feature.id)}
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700 cursor-pointer hover:bg-red-50 rounded-full"
                    >
                      <XMarkIcon className="h-4 w-4 mx-auto" />
                    </button>
                  </div>
                ))}
                {tempFeatures.length === 0 && (
                  <p className="text-center text-gray-500 py-4">
                    No features added yet.
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setIsFeatureModalOpen(false)}
                className="border-red-200 bg-red-50 text-red-500 cursor-pointer hover:bg-red-100 hover:text-red-600 py-2 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveFeatures}
                disabled={isUpdating}
                className="bg-[#022C22] hover:bg-[#033c2e] cursor-pointer !text-white py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isUpdating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  'Save Features'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
