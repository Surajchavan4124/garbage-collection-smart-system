// frontend/src/component/shared/Breadcrumb.jsx

import React from 'react';
import { PRIMARY_COLOR } from '../../config';

const Breadcrumb = ({ path, navigate }) => {
    return (
        <div className="flex text-sm text-gray-500 mb-6 px-4 sm:px-6 lg:px-8">
            {path.map((item, index) => (
                <React.Fragment key={index}>
                    <button
                        onClick={() => item.view && navigate(item.view)}
                        className={`hover:text-${PRIMARY_COLOR} ${!item.view ? 'cursor-default' : ''}`}
                    >
                        {item.label}
                    </button>
                    {index < path.length - 1 && <span className="mx-2 text-gray-400">&gt;</span>}
                </React.Fragment>
            ))}
        </div>
    );
};

export default Breadcrumb;