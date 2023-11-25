import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCategory } from "../../../features/filter/filterSlice";
import fetchFromApi from '../../../pages/api/api';

const Categories = () => {
    const dispatch = useDispatch();
    const { category } = useSelector((state) => state.filter) || {};
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetchFromApi('catagories/')  // replace 'categories/' with the actual endpoint
            .then((data) => setCategories(data))
            .catch((error) => console.error('Error:', error));
    }, []);

    const categoryHandler = (e) => {
        dispatch(addCategory(e.target.value));
    };

    return (
        <>
            <select
                className="form-select"
                value={category}
                onChange={categoryHandler}
            >
                <option value="">Choose a category</option>
                {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                        {category.title}
                    </option>
                ))}
            </select>
            <span className="icon flaticon-briefcase"></span>
        </>
    );
};

export default Categories;
