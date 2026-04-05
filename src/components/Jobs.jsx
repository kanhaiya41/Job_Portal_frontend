import React, { useEffect, useMemo, useState } from 'react';
import Navbar from './shared/Navbar';
import FilterCard from './FilterCard';
import Job from './Job';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

const salaryRanges = {
    '3-5 LPA': [3, 5],
    '5-8 LPA': [5, 8],
    '8-12 LPA': [8, 12],
    '12+ LPA': [12, 999],
};

const Jobs = () => {
    const { allJobs, searchedQuery } = useSelector((store) => store.job);
    const [showFilters, setShowFilters] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState({
        Location: [],
        Industry: [],
        Salary: [],
    });

    const filteredJobs = useMemo(() => {
        if (!Array.isArray(allJobs)) return [];

        return allJobs.filter((job) => {
            const locationMatch =
                selectedFilters.Location.length === 0 ||
                selectedFilters.Location.some((location) =>
                    job.location?.toLowerCase().includes(location.toLowerCase())
                );

            const industryMatch =
                selectedFilters.Industry.length === 0 ||
                selectedFilters.Industry.some((industry) =>
                    job.jobType?.toLowerCase().includes(industry.toLowerCase()) ||
                    job.title?.toLowerCase().includes(industry.toLowerCase())
                );

            const salaryValue = parseFloat(job.salary?.toString()?.replace(/[^0-9.]/g, '')) || 0;
            const salaryMatch =
                selectedFilters.Salary.length === 0 ||
                selectedFilters.Salary.some((salaryKey) => {
                    const range = salaryRanges[salaryKey];
                    return salaryValue >= range[0] && salaryValue <= range[1];
                });

            return locationMatch && industryMatch && salaryMatch;
        });
    }, [allJobs, selectedFilters]);

    const handleFilterChange = (filterType, value) => {
        setSelectedFilters((prev) => {
            const current = prev[filterType] || [];
            const updated = current.includes(value)
                ? current.filter((item) => item !== value)
                : [...current, value];

            return {
                ...prev,
                [filterType]: updated,
            };
        });
    };

    const handleResetFilters = () => {
        setSelectedFilters({
            Location: [],
            Industry: [],
            Salary: [],
        });
    };

    return (
        <div className="bg-slate-50 min-h-screen">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-[300px_1fr]">
                    <div>
                        <div className="mb-4 flex items-center justify-between rounded-3xl border border-slate-200 bg-white px-5 py-4 shadow-sm lg:hidden">
                            <span className="font-semibold text-slate-900">Filter</span>
                            <button
                                type="button"
                                onClick={() => setShowFilters((prev) => !prev)}
                                className="text-sm font-medium text-blue-600 hover:text-blue-800"
                            >
                                {showFilters ? 'Hide' : 'Show'}
                            </button>
                        </div>
                        <div className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
                            <FilterCard
                                selectedFilters={selectedFilters}
                                onFilterChange={handleFilterChange}
                                onReset={handleResetFilters}
                            />
                        </div>
                    </div>

                    <div>
                        <div className="rounded-3xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
                            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                                <h1 className="text-xl font-semibold text-slate-900">Jobs</h1>
                                <p className="text-sm text-slate-500">
                                    {filteredJobs.length} result{filteredJobs.length !== 1 ? 's' : ''}
                                </p>
                            </div>
                            {searchedQuery ? (
                                <p className="mt-2 text-sm text-slate-500">Search query: {searchedQuery}</p>
                            ) : null}
                        </div>

                        <motion.div
                            className="mt-8 grid gap-6"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.4 }}
                        >
                            {filteredJobs.length > 0 ? (
                                filteredJobs.map((job) => (
                                    <motion.div
                                        key={job?._id}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ type: 'spring', stiffness: 220, damping: 22 }}
                                    >
                                        <Job job={job} />
                                    </motion.div>
                                ))
                            ) : (
                                <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600">
                                    {allJobs.length > 0
                                        ? 'No matching jobs found for selected filters.'
                                        : 'No jobs found. Please try again later.'}
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Jobs;
