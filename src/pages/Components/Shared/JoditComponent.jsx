import React, { memo, useMemo, useRef } from 'react';
import JoditEditor from 'jodit-react';

const JoditComponent = ({ content, setContent }) => {
  const editor = useRef(null);
  const config = useMemo(
    () => ({
      readonly: false,
      toolbarSticky: false,
      minHeight: 500,
      buttons: [
        'bold',
        'italic',
        'underline',
        'strikethrough',
        'ul',
        'ol',
        'outdent',
        'indent',
        'font',
        'fontsize',
        'brush',
        'paragraph',
        'image',
        'table',
        'link',
        'align',
        'undo',
        'redo',
        'hr',
        'eraser',
        'copyformat',
        'fullsize',
        'preview',
      ],
      uploader: {
        insertImageAsBase64URI: true,
      },
      style: {
        fontFamily: 'inherit',
        fontSize: '16px',
      },
    }),
    []
  );
  return (
    <div>
      <JoditEditor
        ref={editor}
        value={content || ''}
        onBlur={(newContent) => setContent(newContent)}
        config={config}
      />
    </div>
  );
};

export default memo(JoditComponent);
