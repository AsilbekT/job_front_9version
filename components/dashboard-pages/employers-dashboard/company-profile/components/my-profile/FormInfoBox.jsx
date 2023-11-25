import { useCallback, useContext, useState } from "react";
import { useFetch } from "../../../../../../hooks/useFetch";
import { UserContext } from "../../../../../../pages/context/UserContext";
import LogoUpload from "../../../../candidates-dashboard/my-profile/components/my-profile/LogoUpload";

const FormInfoBox = (props) => {
    const {
        setEditMode,
        setForm,
        form,
        companyLogo,
        setCompanyLogo
    } = props;
    const user = useContext(UserContext);
    const companyFetch = useFetch(false);
    const [success, setSuccess] = useState(false);
    const [imageUrl, setImageUrl] = useState(null);
    const [validationError, setValidationError] = useState('');

    const company = user?.companyData;

    const onChangeForm = useCallback((key, value) => {
        setForm(prev => ({
            ...prev,
            [key]: value
        }));
    }, []);

    const onUploadCompanyLogo = useCallback(async (e) => {
        const [logo] = e.target.files;
        if (!logo) return;
        const formData = new FormData();
        formData.append('company_logo', logo);
        const response = await companyFetch.makeRequest(
            `/companies/${company.id}/`,
            {
                method: 'PATCH',
                body: formData
            },
            true
        );
        if (response) {
            const fileReader = new FileReader();
            fileReader.onload = function () {
                setImageUrl(this.result);
            };
            fileReader.readAsDataURL(logo);
            setCompanyLogo(logo.name);
        }
    }, [company]);

    const onSaveCompany = useCallback(async (e) => {
        setSuccess(false);
        setValidationError('');
        e.preventDefault();
        const formCopy = { ...form, owner: user.id };
        if (formCopy.company_logo) {
            delete formCopy['company_logo'];
        }
        const response = await companyFetch.makeRequest(
            company ? `/companies/${company.id}/` : '/companies/',
            {
                method: company ? 'PATCH' : 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formCopy)
            }
        );
        if (!response.error) {
            setSuccess(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setTimeout(() => {
                setSuccess(false);
            }, 5000);
            if (typeof setEditMode === 'function') {
                setEditMode(false);
            }
            window.location.reload();
        } else {
            setValidationError(
                Object.values(response)
                    .flat()
                    .filter(val => typeof val === 'string')
                    .join(' ')
            );
        }
    }, [company, form, user]);

    if ((!company && !user) || companyFetch.loading) {
        return <h6 className="text-center">Loading...</h6>
    }

    return (
        <div className="widget-content">

            <form className="default-form" onSubmit={onSaveCompany}>
                {success && (
                    <h5 className="success mb-4">
                        Company information has successfully been saved
                    </h5>
                )}
                {(companyFetch.error || validationError) && (
                    <h5 className="error mb-4">{validationError || 'Something went wrong😐'}</h5>
                )}
                <div className="row">
                    {/* <!-- Input --> */}
                    <LogoUpload />

                    {company && (
                        <div className="uploading-outer">
                            <label className="w-25">Company Logo</label>
                            <label className="uploadButton" tabIndex={0}>
                                <figure className="image-overlay">
                                    <img src={imageUrl || company?.company_logo || '/images/User-avatar.svg.png'} alt="User Avatart" width="100%" height="100%" />
                                </figure>
                                <input
                                    className="uploadButton-input"
                                    type="file"
                                    accept="image/*"
                                    id="upload-t"
                                    onChange={onUploadCompanyLogo}
                                />
                                <span className="uploadButton-file-name"></span>
                            </label>
                            <div className="text d-flex flex-column mx-3">
                                <label
                                    className="uploadButton-button ripple-effect"
                                    htmlFor="upload-t"
                                >
                                    {companyLogo || "Browse Image"}
                                </label>
                                Suitable files are .jpg & .png
                            </div>
                        </div>
                    )}

                    <div className="form-group col-lg-6 col-md-12">
                        <label>Company name (optional)</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Invisionn"
                            required
                            value={form.title}
                            onChange={(e) => onChangeForm('title', e.target.value)}
                        />
                    </div>

                    {/* <!-- Input --> */}
                    {/* <div className="form-group col-lg-6 col-md-12">
                        <label>Email address</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="ib-themes"
                            required
                        />
                    </div> */}

                    {/* <!-- Input --> */}
                    {/* <div className="form-group col-lg-6 col-md-12">
                        <label>Phone</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="0 123 456 7890"
                            required
                        />
                    </div> */}

                    {/* <!-- Input --> */}
                    <div className="form-group col-lg-6 col-md-12">
                        <label>Website</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="e.g. https://invision.com"
                            required
                            value={form.website}
                            onChange={(e) => onChangeForm('website', e.target.value)}
                        />
                    </div>

                    {/* <!-- Input --> */}
                    {/* <div className="form-group col-lg-6 col-md-12">
                        <label>Est. Since</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="06.04.2020"
                            required
                        />
                    </div> */}

                    {/* <!-- Input --> */}
                    {/* <div className="form-group col-lg-6 col-md-12">
                        <label>Team Size</label>
                        <select className="chosen-single form-select" required>
                            <option>50 - 100</option>
                            <option>100 - 150</option>
                            <option>200 - 250</option>
                            <option>300 - 350</option>
                            <option>500 - 1000</option>
                        </select>
                    </div> */}

                    {/* <!-- Search Select --> */}
                    {/* <div className="form-group col-lg-6 col-md-12">
                        <label>Multiple Select boxes </label>
                        <Select
                            defaultValue={[catOptions[2]]}
                            isMulti
                            name="colors"
                            options={catOptions}
                            className="basic-multi-select"
                            classNamePrefix="select"
                        />
                    </div> */}

                    {/* <!-- Input --> */}
                    {/* <div className="form-group col-lg-6 col-md-12">
                        <label>Allow In Search & Listing</label>
                        <select className="chosen-single form-select">
                            <option>Yes</option>
                            <option>No</option>
                        </select>
                    </div> */}

                    {/* <!-- About Company --> */}
                    <div className="form-group col-lg-12 col-md-12">
                        <label>About Company</label>
                        <textarea
                            placeholder="about"
                            value={form.description}
                            onChange={(e) => onChangeForm('description', e.target.value)}
                        />
                    </div>

                    {/* <!-- Input --> */}
                    <div className="w-full pb-4 d-flex gap-2 justify-content-end">
                        <button
                            className="theme-btn btn-style-two"
                            type="button"
                            onClick={() => setEditMode(false)}
                        >
                            Cancel
                        </button>
                        <button className="theme-btn btn-style-one" type="submit">Save</button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default FormInfoBox;
