import Link from "next/link";
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import {
    addCategory,
    addDatePosted,
    addDestination,
    addKeyword,
    addLocation,
    addPerPage,
    addSalary,
    addSort,
    addTag,
    clearExperience,
    clearJobType,
} from "../../../features/filter/filterSlice";
import {
    clearDatePostToggle,
    clearExperienceToggle,
    clearJobTypeToggle,
} from "../../../features/job/jobSlice";

import fetchFromApi from '../../../pages/api/api';

const FilterJobsBox = () => {
    const { jobList, jobSort } = useSelector((state) => state.filter);
    const {
        keyword,
        location,
        destination,
        category,
        job_type,
        datePosted,
        experience,
        salary,
        tag,
    } = jobList || {};

    const { sort, perPage } = jobSort;

    const dispatch = useDispatch();
    const [jobs, setJobs] = useState([]);  // state for storing the jobs data
    const [displayCount, setDisplayCount] = useState(10);  // state for storing the number of displayed jobs

    useEffect(() => {
        fetchFromApi('jobs/')  // replace 'your-endpoint' with the actual endpoint
            .then((data) => setJobs(data))
            .catch((error) => console.error('Error:', error));
    }, []);

    // keyword filter on title
    const keywordFilter = (item) =>
        keyword !== ""
            ? item.job_title
                .toLocaleLowerCase()
                .includes(keyword.toLocaleLowerCase())
            : item;

    // location filter
    const locationFilter = (item) =>
        location !== ""
            ? item?.location
                ?.toLocaleLowerCase()
                .includes(location?.toLocaleLowerCase())
            : item;

    // location filter
    const destinationFilter = (item) =>
        item?.destination?.min >= destination?.min &&
        item?.destination?.max <= destination?.max;

    // category filter
    const categoryFilter = (item) => {
        return (
            category !== ""
                ? item?.category === parseInt(category)
                : item
        );
    };




    const jobTypeFilter = (item) => {
        const jobTypeArray = Object.values(job_type);
        return (
            jobTypeArray.length !== 0 && item?.job_type !== undefined
                ? jobTypeArray.includes(item?.job_type)
                : item
        );
    };

    // date-posted filter
    const datePostedFilter = (item) =>
        datePosted !== "all" && datePosted !== ""
            ? item?.created_at
                ?.toLocaleLowerCase()
                .split(" ")
                .join("-")
                .includes(datePosted)
            : item;

    // experience level filter
    const experienceFilter = (item) =>
        experience?.length !== 0
            ? experience?.includes(
                item?.experience?.split(" ").join("-").toLocaleLowerCase()
            )
            : item;

    // salary filter
    const salaryFilter = (item) =>
        item?.totalSalary?.min >= salary?.min &&
        item?.totalSalary?.max <= salary?.max;

    // tag filter
    const tagFilter = (item) => (tag !== "" ? item?.tag === tag : item);

    // sort filter
    const sortFilter = (a, b) => {
        // console.log(new Date(b.created_at) - new Date(a.created_at));
        // console.log(new Date(a.created_at) - new Date(b.created_at));
        if (sort === "des") {
            return new Date(a.created_at) - new Date(b.created_at);
        } else {
            return new Date(b.created_at) - new Date(a.created_at);
        }
    };
    let content = jobs
        ?.filter(keywordFilter)
        ?.filter(locationFilter)
        ?.filter(destinationFilter)
        ?.filter(categoryFilter)
        ?.filter(jobTypeFilter)
        ?.filter(datePostedFilter)
        ?.filter(experienceFilter)
        ?.filter(salaryFilter)
        ?.filter(tagFilter)
        ?.sort(sortFilter)
        .slice(0, displayCount)  // use displayCount instead of perPage.end
        ?.map((item) => (
            <div className="job-block" key={item.id}>
                <div className="inner-box">
                    <div className="content">
                        <span className="company-logo">
                            <img src={item.logo} alt="item brand" />
                        </span>
                        <h4>
                            <Link href={`/jobs/${item.id}`}>
                                {item.job_title}
                            </Link>
                        </h4>

                        <ul className="job-info">
                            <li>
                                <span className="icon flaticon-briefcase"></span>
                                {item.company}
                            </li>
                            {/* compnay info */}
                            {item.location.trim().length > 0 && (
                                <li>
                                    <span className="icon flaticon-map-locator"></span>
                                    {item.location}
                                </li>
                            )}
                            {/* location info */}
                            <li>
                                <span className="icon flaticon-clock-3"></span>{" "}
                                {item.time}
                            </li>
                            {/* time info */}
                            <li>
                                <span className="icon flaticon-money"></span>{" "}
                                ${item.salary}
                            </li>
                            {/* salary info */}
                        </ul>
                        {/* End .job-info */}

                        <ul className="job-other-info">
                            {Array.isArray(item.job_type)
                                ? item.job_type.map((val, i) => (
                                    <li key={i} className={`${val.styleClass}`}>
                                        {val.type}
                                    </li>
                                ))
                                : Object.values(item.job_type).map((val, i) => (
                                    <li key={i} className={`${val.styleClass}`}>
                                        {val.type}
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                </div>
            </div>
            // End all jobs
        ));


    // sort handler
    const sortHandler = (e) => {
        dispatch(addSort(e.target.value));
    };

    // per page handler
    const perPageHandler = (e) => {
        const pageData = JSON.parse(e.target.value);
        dispatch(addPerPage(pageData));
    };

    // clear all filters
    const clearAll = () => {
        dispatch(addKeyword(""));
        dispatch(addLocation(""));
        dispatch(addDestination({ min: 0, max: 100 }));
        dispatch(addCategory(""));
        dispatch(clearJobType());
        dispatch(clearJobTypeToggle());
        dispatch(addDatePosted(""));
        dispatch(clearDatePostToggle());
        dispatch(clearExperience());
        dispatch(clearExperienceToggle());
        dispatch(addSalary({ min: 0, max: 20000 }));
        dispatch(addTag(""));
        dispatch(addSort(""));
        dispatch(addPerPage({ start: 0, end: 0 }));
    };


    // show more jobs
    const showMoreJobs = () => {
        setDisplayCount(prevDisplayCount => prevDisplayCount + 10);
    };

    return (
        <>
            <div className="ls-switcher">
                <div className="show-result">
                    <div className="show-1023">
                        <button
                            type="button"
                            className="theme-btn toggle-filters "
                            data-bs-toggle="offcanvas"
                            data-bs-target="#filter-sidebar"
                        >
                            <span className="icon icon-filter"></span> Filter
                        </button>
                    </div>
                    {/* Collapsible sidebar button */}

                    <div className="text">
                        Show <strong>{content?.length}</strong> jobs
                    </div>
                </div>
                {/* End show-result */}

                <div className="sort-by">
                    {keyword !== "" ||
                        location !== "" ||
                        destination?.min !== 0 ||
                        destination?.max !== 100 ||
                        category !== "" ||
                        job_type?.length !== 0 ||
                        datePosted !== "" ||
                        experience?.length !== 0 ||
                        salary?.min !== 0 ||
                        salary?.max !== 20000 ||
                        tag !== "" ||
                        sort !== "" ||
                        perPage.start !== 0 ||
                        perPage.end !== 0 ? (
                        <button
                            onClick={clearAll}
                            className="btn btn-danger text-nowrap me-2"
                            style={{ minHeight: "45px", marginBottom: "15px" }}
                        >
                            Clear All
                        </button>
                    ) : undefined}

                    <select
                        value={sort}
                        className="chosen-single form-select"
                        onChange={sortHandler}
                    >
                        <option value="">Sort by (default)</option>
                        <option value="des">Oldest</option>
                        <option value="asc">Newest</option>
                    </select>
                    {/* End select */}

                    {/* End select */}
                </div>
            </div>
            {/* End top filter bar box */}
            {content}
            {/* <!-- List Show More --> */}
            <div className="ls-show-more">
                <p>Show {content.length} of {jobs.length} Jobs</p>
                <div className="bar">
                    <span className="bar-inner" style={{ width: `${(content.length / jobs.length) * 100}%` }}></span>
                </div>
                <button onClick={showMoreJobs} className="show-more">Show More</button>
            </div>
        </>
    );
};

export default FilterJobsBox;
