import { useEffect, useState } from "react";
import Link from "next/link";
import {
  candidateItems,
  employerItems,
  findJobItems,
  pageItems,
  shopItems,
} from "../../data/mainMenuData";
import {
  isActiveParent,
  isActiveLink,
  isActiveParentChaild,
} from "../../utils/linkActiveChecker";
import { useRouter } from "next/router";
import cookie from 'js-cookie';
import fetchFromApi from '../../pages/api/api';

const HeaderNavContent = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = cookie.get('token');

      if (token) {
        try {
          const data = await fetchFromApi('user/', 'GET', null, {
            Authorization: `Token ${token}`,
          });

          setUser(data[0]);
        } catch (error) {
          console.error('Failed to fetch user:', error);
        }
      }
    };

    fetchUser();
  }, []);

  return (
    <>
      <nav className="nav main-menu">
        <ul className="navigation" id="navbar">
          {/* current dropdown */}

          <li className={`${isActiveLink('/', router.asPath) ? "current" : ""}`}>
            <Link href="/">Find Jobs</Link>
          </li>

          {/* End findjobs menu items */}
          {user?.is_employer && (
            <li
              className={`${isActiveParent(employerItems, router.asPath) ||
                router.asPath === "/employer/dashboard"
                ? "current"
                : ""
                } dropdown`}
            >
              <Link href="/employer/dashboard">
                Employers Dashboard
              </Link>
            </li>
          )}
          {/* End Employers menu items */}
          {user && !user.is_employer && (
            <li
              className={`${isActiveParent(candidateItems, router.asPath) ||
                router.asPath === "/candidate/dashboard"
                ? "current"
                : ""
                  ? "current"
                  : ""
                } dropdown`}
            >
              <Link href="/candidate/dashboard">
                Candidates Dashboard
              </Link>
            </li>
          )}
          {/* End Candidates menu items */}
          <li
            className={`${isActiveParentChaild(pageItems, router.asPath) ||
              isActiveParentChaild(shopItems[0].items, router.asPath)
              ? "current "
              : ""
              } dropdown`}
          >
            <span>Pages</span>
            <ul>
              {pageItems.map((item, i) => (
                <li
                  className={
                    isActiveLink(item.routePath, router.asPath) ? "current" : ""
                  }
                  key={i}
                >
                  <Link href={item.routePath}>{item.name}</Link>
                </li>
              ))}
            </ul>
          </li>
          {/* End Pages menu items */}
        </ul>
      </nav>
    </>
  );
};

export default HeaderNavContent;
