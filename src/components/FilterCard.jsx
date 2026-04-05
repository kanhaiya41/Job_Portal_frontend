import React from 'react';
import { motion } from 'framer-motion';

const filterData = [
    {
        filterType: 'Location',
        array: ['Delhi NCR', 'Bangalore', 'Hyderabad', 'Pune', 'Mumbai'],
    },
    {
        filterType: 'Industry',
        array: ['Frontend Developer', 'Backend Developer', 'FullStack Developer'],
    },
    {
        filterType: 'Salary',
        array: ['3-5 LPA', '5-8 LPA', '8-12 LPA', '12+ LPA'],
    },
];

const FilterCard = ({ selectedFilters, onFilterChange, onReset }) => {
    return (
        <motion.div
            className="w-full rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold text-slate-900">Filter Jobs</h1>
                    <p className="text-sm text-slate-500 mt-1">Choose filters to narrow results.</p>
                </div>
                <button
                    type="button"
                    onClick={ onReset }
                    className="text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                    Reset
                </button>
            </div>

            <div className="mt-5 space-y-5">
                {filterData.map((group, index) => (
                    <div key={ index }>
                        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-700">
                            {group.filterType}
                        </h2>
                        <div className="space-y-3">
                            {group.array.map((option, idx) => {
                                const itemId = `${group.filterType}-${idx}`;
                                const isChecked = selectedFilters[group.filterType]?.includes(option);

                                return (
                                    <label
                                        key={ itemId }
                                        htmlFor={ itemId }
                                        className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 transition hover:border-slate-300"
                                    >
                                        <input
                                            id={ itemId }
                                            type="checkbox"
                                            checked={ isChecked }
                                            onChange={ () => onFilterChange(group.filterType, option) }
                                            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-sm text-slate-700">{option}</span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export default FilterCard;
