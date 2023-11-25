import { useContext, useEffect, useState } from "react";
import { useFetch } from "../../../../../../hooks/useFetch";
import { UserContext } from "../../../../../../pages/context/UserContext";

const DEFAULT_IMAGE_SRC = '/images/User-avatar.svg.png';

export const getDefaultImage = (image) => {
    return image?.includes('default') ? DEFAULT_IMAGE_SRC : (image || DEFAULT_IMAGE_SRC);
};

const LogoUpload = ({ title = 'Profile Image', }) => {
    const [logImg, setLogoImg] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const uploadFetch = useFetch();

    const user = useContext(UserContext);

    useEffect(() => {
        if (user) {
            const fileName = user?.avatar.split('/').at(-1);
            setLogoImg({ name: fileName || '' });
        }
    }, [user]);

    const logImgHander = async (e) => {
        try {
            const [logoImg] = e.target.files;
            const formData = new FormData();
            formData.append('avatar', logoImg);
            await uploadFetch.makeRequest(`/user/${user.id}/upload_files/`, {
                method: 'PATCH',
                body: formData
            });
            const fileReader = new FileReader();
            fileReader.onload = function () {
                setImageUrl(this.result);
            };
            fileReader.readAsDataURL(logoImg);
            setLogoImg(logImg);
            window.location.reload();
        } catch (er) {
            console.log(er);
        }
    };

    return (
        <div className="uploading-outer">
            <label className="w-25">{title}</label>
            <label className="uploadButton" tabIndex={0}>
                <figure className="image-overlay">
                    <img
                        src={getDefaultImage(imageUrl || user?.avatar)}
                        alt="User Avatart"
                        width="100%"
                        height="100%"
                    />
                </figure>
                <input
                    className="uploadButton-input"
                    type="file"
                    accept="image/*"
                    id="upload-t"
                    onChange={logImgHander}
                />
                <span className="uploadButton-file-name"></span>
            </label>
            <div className="text d-flex flex-column mx-3">
                <label
                    className="uploadButton-button ripple-effect"
                    htmlFor="upload-t"
                >
                    {logImg ? logImg.name : "Browse Image"}
                </label>
                Suitable files are .jpg & .png
            </div>
        </div>
    );
};

export default LogoUpload;
