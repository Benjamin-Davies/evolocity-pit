import React from 'react';

import './Loading.css';

export interface LoadingProps {
  what?: string;
}

function Loading({ what }: LoadingProps) {
  return (
    <div>
      <div className="Loading-spinner" />
      <h3>
        Loading
        {what ? ` ${what}` : null}
        <span className="Loading-dot-1">.</span>
        <span className="Loading-dot-2">.</span>
        <span className="Loading-dot-3">.</span>
      </h3>
    </div>
  );
}

export default Loading;
