import { systemService } from "@services/system.service";
import Router, { useRouter } from "next/router";
import BlankWithFooterLayout from "src/components/layouts/blank-with-footer";
import { authService } from "src/services/auth.service";
import PageTitle from "@components/page-title";
import { useEffect, useState } from "react";
import DummyHeader from "@components/common-layout/dummyheader/dummyheader";
import { Country } from "country-state-city";
import Link from "next/link";
import { connect, ConnectedProps } from "react-redux";
import { toast } from "react-toastify";
import { setLogin } from "src/redux/auth/actions";
import { showError } from "@lib/utils";
import { Baseurl } from "@services/api-request";
interface FormData {
  email: string;
  password: string;
  isKeepLogin: boolean;
}
interface IProps {
  authUser: any;
  transparentLogo: string;
  authBgImage: string;
}
const mapDispatch = {
  dispatchSetLogin: setLogin,
};

const connector = connect(null, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;
function Home({ authUser, dispatchSetLogin }: IProps & PropsFromRedux) {
  const router = useRouter();
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [showCountrySelect, setShowCountrySelect] = useState("");
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [heartClickedId, setHeartClickedId] = useState(null);
  const [country, setCountry] = useState([]);
  const [userData, setUserData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [perPage] = useState(10);
  const [isauthusertrue, setisauthusertrue] = useState(false);

  const bg = "/images/girls2Dreamlogo.png";
  const checkAuthUser = () => {
    if (authService.isLoggedin()) {
      if (!authUser) {
        authService.removeToken();
        router.push("/auth/login");
      }
      if (authUser && (!authUser.isCompletedProfile || !authUser.isApproved)) {
        Router.push("/profile/update?requireUpdate=1");
      } else {
        router.push("/conversation");
      }
    }
  };
  const [isModalOpen, setIsModalOpen] = useState(false);

  // useEffect(()=>{
  //   const accessToken = authService.getToken();
  //   if(accessToken){
  //    router.push("/models");
  //   }
  // },[])
  const handlechatclick = () => {
    if (authUser) {
      router.push("/models");
    } else {
      setIsModalOpen(true);
    }
  };
  const openModal = () => {
    setIsModalOpen(true);
  };



  useEffect(() => {
    if (authUser) {
      setisauthusertrue(true);
    }
  }, []);

  const closeModal = () => {
    setIsModalOpen(false);
  };
  useEffect(() => {
    checkAuthUser();
    handleGetAllCountries();
  }, [authUser]);

  const handleGetAllCountries = async () => {
    const countriesData = await Country.getAllCountries().map((i) => ({
      isoCode: i.isoCode,
      name: i.name,
    }));
    setCountry(countriesData);
  };

  const handleShowLoginPage = () => {
    window.location.href = "/auth/login";
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        let url = `${Baseurl}/users/search/testing?gender=${selectedGender}&page=${page}`;
        if (selectedCountry && selectedCountry !== "county") {
          url += `&country=${selectedCountry}`;
        }

        const response = await fetch(url);
        const data = await response.json();
        setUserData(data.result);
        setTotalCount(data.totalCount);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [selectedGender, selectedCountry, page]);

  const handleHeartClick = (_id) => {
    console.log(`Heart icon clicked for item with ID: ${_id}`);
    openModal();
    setHeartClickedId(_id);
  };

  const handleChatButtonClick = (_id) => {
    handleShowLoginPage();
    console.log(`Chat button clicked for item with ID: ${_id}`);
  };

  const handleProfileButtonClick = (_id) => {
    openModal();
    console.log(`Profile button clicked for item with ID: ${_id}`);
  };

  const handleTogglePwVisibility = () => {
    setShowPw(!showPw);
  };
  const nextPage = () => {
    if (page * perPage <= totalCount) {
      setPage(page + 1);
    }
  };
  const prevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };
  const dummyData = [
    {
      verificationDocument: {
        birthday: "",
      },
      _id: "666034a21fc88e2ae4b698c6",
      role: "user",
      gender: "female",
      name: "Test Model 1",
      daysAgo: "20 days ago",
      avatarUrl: "https://api.girls2dream.com/avatar/ScDcK_200x200.png",
    },
    {
      verificationDocument: {
        birthday: "30",
      },
      _id: "666034a21fc88e2ae4b698c7",
      role: "user",
      gender: "male",
      name: "Test Model 1",
      daysAgo: "20 days ago",
      avatarUrl: "https://api.girls2dream.com/avatar/ScDcK_200x200.png",
    },
    {
      verificationDocument: {
        birthday: "",
      },
      _id: "666034a21fc88e2ae4b698c8",
      role: "user",
      gender: "female",
      name: "Test Model3",
      daysAgo: "20 days ago",
      avatarUrl: "https://api.girls2dream.com/avatar/ScDcK_200x200.png",
    },
    {
      verificationDocument: {
        birthday: "30",
      },
      _id: "666034a21fc88e2ae4b698c9",
      role: "user",
      gender: "male",
      name: "Test Model4",
      daysAgo: "20 days ago",
      avatarUrl: "https://api.girls2dream.com/avatar/ScDcK_200x200.png",
    },
    {
      verificationDocument: {
        birthday: "",
      },
      _id: "666034a21fc88e2ae4b668c6",
      role: "user",
      gender: "female",
      name: "Test Model 1",
      daysAgo: "20 days ago",
      avatarUrl: "https://api.girls2dream.com/avatar/ScDcK_200x200.png",
    },
    {
      verificationDocument: {
        birthday: "30",
      },
      _id: "666034a21fc88e2ae4b678c7",
      role: "user",
      gender: "male",
      name: "Test Model 1",
      daysAgo: "20 days ago",
      avatarUrl: "https://api.girls2dream.com/avatar/ScDcK_200x200.png",
    },
    {
      verificationDocument: {
        birthday: "",
      },
      _id: "666034a21fc88e2ae4b688c8",
      role: "user",
      gender: "female",
      name: "Test Model3",
      daysAgo: "20 days ago",
      avatarUrl: "https://api.girls2dream.com/avatar/ScDcK_200x200.png",
    },
    {
      verificationDocument: {
        birthday: "30",
      },
      _id: "666034a21fc88e2ae4b998c9",
      role: "user",
      gender: "male",
      name: "Test Model4",
      daysAgo: "20 days ago",
      avatarUrl: "https://api.girls2dream.com/avatar/ScDcK_200x200.png",
    },
  ];
  const [showPw, setShowPw] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    isKeepLogin: false,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors: { [key: string]: string } = {};

    if (!formData.email) {
      validationErrors.email = "E-Mail wird benötigt";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      validationErrors.email = "E-Mail-Format ist nicht korrekt";
    }

    if (!formData.password) {
      validationErrors.password = "Passwort wird benötigt";
    } else {
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(formData.password)) {
        validationErrors.password =
          "Passwort muss mindestens 8 Zeichen lang sein, mindestens 1 Zahl, 1 Großbuchstaben, 1 Kleinbuchstaben und 1 Sonderzeichen enthalten";
      } else {
        delete validationErrors.password;
      }
    }
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      try {
        const resp = await authService.login(formData);
        const { token } = resp.data;
        authService.setAuthHeaderToken(token);
        authService.setToken(token);
        const me = await authService.me({
          Authorization: `Bearer ${token}`,
        });

        if (resp.code === 200) {
          router.push("/models");
        }
      } catch (e) {
        const error = await e;
        toast.error(error?.data?.message || showError(e));
        setLoading(false);
      }
    }
  };
  const handleByCoinsClick = (value) => {
    if (value === true) {
      if (authUser) {
        router.push("/tokens");
      } else {
        setIsModalOpen(true);
      }
    }
  };
  const handleByfavoritesClick = (value) => {
    if (value === true) {
      if (authUser) {
        router.push("/favorites");
      } else {
        setIsModalOpen(true);
      }
    }
  };
  const handlemodelsClick = (value) => {
    if (value === true) {
      if (authUser) {
        router.push("/models");
      } else {
        setIsModalOpen(true);
      }
    }
  };
  const handleconversationClick = (value) => {
    if (value === true) {
      if (authUser) {
        router.push("/conversation");
      } else {
        setIsModalOpen(true);
      }
    }
  };
  const inviteClickHandler = (value) => {
    if (value === true) {
      setIsModalOpen(true);
    }
  };

  return (
    <section className="main scroll">
      <PageTitle title="Startseite" />
      <DummyHeader
        onByCoinsClick={handleByCoinsClick}
        isAuthUserTrue={isauthusertrue}
        onByfavoriteClick={handleByfavoritesClick}
        onBymodelsClick={handlemodelsClick}
        onByconversationClick={handleconversationClick}
        inviteClick={inviteClickHandler}
      />
      <div className="container-fluid">
        <div className="row">
          <div className="row col-md-12 col-12 " style={{ flexWrap: "wrap" }}>
            <div className="col-md-6 col-12 text-left">
              <h4 className="set-font-size my-3">
                Werden Sie intim. Keine Bedingungen gestellt!
              </h4>
            </div>
            <div className="col-md-6 col-12 text-right">
              <div className="row justify-content-end">
                <div className="dropdown mr-2">
                  <select
                    className="btn btn-outline-default dropdown-toggle"
                    value={selectedGender}
                    onChange={(e) => setSelectedGender(e.target.value)}
                  >
                    <option value="">Alle</option>
                    <option value="male">Männlich</option>
                    <option value="female">Weiblich</option>
                    <option value="transgender">Transsexuelle</option>
                  </select>
                </div>

                <div className="dropdown mr-2">
                  <select
                    className="btn btn-outline-default dropdown-toggle"
                    value={selectedCountry}
                    onChange={(e) => {
                      setSelectedCountry(e.target.value);

                      if (e.target.value === "") {
                        setShowCountrySelect("");
                      } else {
                        setShowCountrySelect(e.target.value);
                      }
                    }}
                  >
                     <option value="county">Dein Land</option>
                    <option value="">Alle Land</option>
                   
                  </select>
                </div>

                <div className="dropdown mr-2">
                  <form className="form-inline">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control search border-right-0 transparent-bg pr-0"
                        name="username"
                        id="username"
                        placeholder="Modellname eingeben"
                        onChange={(e) => console.log(e.target.value)}
                      />
                      <div className="input-group-append">
                        <button
                          type="submit"
                          className="input-group-text transparent-bg border-left-0"
                        >
                          <svg
                            className="text-muted hw-20"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
                {showCountrySelect === "county" && (
                  <div className="dropdown mr-2">
                    <select
                      className="btn btn-outline-default dropdown-toggle"
                      onChange={(e) => {
                        setSelectedCountry(e.target.value);
                      }}
                    >
                      {country.map((country, index) => (
                        <option key={index} value={country.name}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="col-md-12 col-12"  >
            <div>
              <div style={{ display: "flex", flexWrap: "wrap" ,minHeight:"420px" }}>
              {dummyData.length === 0 ? (
                   <div >No result found</div>
                   ) : (
                   dummyData.map((data, index) => (
                  <div
                    key={index}
                    style={{
                      margin: "auto",
                      border: "1px solid #e3e3e3",
                      borderRadius: "11px",
                      marginTop: "10px"
                    }}
                  >
                    <div
                      style={{ position: "relative", margin: "10px" }}
                      onMouseEnter={() => setHoveredIndex(data._id)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    >
                      <img
                        src={data.avatarUrl}
                        alt="Card"
                        style={{
                          width: "280px",
                          height: "280px",
                          objectFit: "cover",
                          borderRadius: "11px",
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          top: "10px",
                          left: "10px",
                          color: "#fff",
                          zIndex: 1,
                        }}
                      >
                        {data.daysAgo}
                      </div>
                      <span
                        style={{
                          position: "absolute",
                          top: "10px",
                          right: "10px",
                          color: heartClickedId === data._id ? "red" : "#fff",
                          zIndex: 1,
                          cursor: "pointer",
                        }}
                        onClick={() => handleHeartClick(data._id)}
                      >
                        {heartClickedId === data._id ? "❤️" : "🤍"}
                      </span>
                      {hoveredIndex === data._id && (
                        <div>
                          <div
                            style={{
                              position: "absolute",
                              bottom: "40px",
                              left: "30px",
                              backgroundColor: "transparent",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              boxSizing: "border-box",
                              width: "calc(50% - 15px)",
                              zIndex: 1,
                            }}
                          >
                            <button
                              className="mx-1 btn btn-primary"
                              type="button"
                              onClick={() => handlechatclick()}
                            >
                              <i className="far fa-comments" />
                              <span
                                style={{ fontSize: "11px", marginLeft: "5px" }}
                              >
                                Chatten
                              </span>
                            </button>
                          </div>
                          <div
                            style={{
                              position: "absolute",
                              bottom: "40px",
                              right: "5px",
                              backgroundColor: "transparent",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              boxSizing: "border-box",
                              width: "calc(50% - 15px)",
                              zIndex: 1,
                            }}
                          >
                            <button
                              className="btn btn-primary btn-secondary"
                              type="button"
                              onClick={() => handleProfileButtonClick(data._id)}
                            >
                              <i className="fas fa-user-circle" />
                              <span
                                style={{ fontSize: "11px", marginLeft: "5px" }}
                              >
                                Profil prüfen
                              </span>
                            </button>
                          </div>
                        </div>
                      )}
                      <div
                        style={{
                          position: "absolute",
                          textAlign: "center",
                          width: "100%",
                          top: "94%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          backgroundColor: "#000000ad",
                          color: "#fff",
                          padding: "5px",
                          zIndex: 2,
                          borderBottomLeftRadius: "10px",
                          borderBottomRightRadius: "10px",
                          cursor: "pointer",
                        }}
                        onClick={openModal}
                      >
                        <i style={{color:"#ff337c" ,fontStyle:"normal"}}> {data.name }</i>
                        
                        {/* {data.verificationDocument.firstName +
                          data.verificationDocument.lastName} */}
                        <i
                          className={
                            data.gender === "male"
                              ? "fas fa-mars"
                              : "fas fa-venus"
                          }
                          style={{ marginLeft: "5px" }}
                        ></i>
                        {data.gender === "male"
                          ? "M"
                          : data.gender === "female"
                          ? "F"
                          : "Other"}
                        <i
                          className="fa-duotone fa-cake-candles"
                          style={{ marginLeft: "5px" }}
                        ></i>
                        {data.verificationDocument.birthday}
                      </div>
                    </div>
                  </div>
                    ))
               )}
              </div>
            </div>
            <br />
            <br />
            <br />
            {/* <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
              <button onClick={prevPage} disabled={page === 1}>Previous</button>
              <button onClick={nextPage} disabled={(page + 1) * perPage < totalCount}>Next</button>
            </div> */}

{/* <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
  {page > 1 && (
    <button onClick={prevPage}>Previous</button>
  )}
  <span style={{ margin: "0 10px" }}>
    Page {page} of {Math.ceil(totalCount / perPage)}
  </span>
  {((page * perPage) < totalCount) && (
    <button onClick={nextPage}>Next</button>
  )}
</div> */}
          </div>
        </div>
        <div
          className={`modal ${isModalOpen ? "show" : ""}`}
          role="dialog"
          style={{
            display: isModalOpen ? "block" : "none",
            marginTop: "80px",
            maxHeight:"100%"
          }}
        >
          <div
            className="modal-dialog"
            role="document"
            style={{ maxWidth: "500px" }}
          >
            <div className="modal-content">
              <div className="modal-body2">
                <div>
                  <div>
                    <img src={bg} style={{ width: "28%", marginLeft: "36%" }} />
                    <button
                      type="button"
                      className="close"
                      onClick={closeModal}
                      style={{
                        padding: 0,
                        margin: 0,
                        border: "none",
                        background: "none",
                      }}
                    >
                      <span aria-hidden="true" style={{ fontSize: "1.5rem" }}>
                        &times;
                      </span>
                    </button>
                    <h5 className="text-center text-uppercase">Anmeldung</h5>
                    <div className="xchat-form">
                      <form onSubmit={handleSubmit}>
                        <div>
                          <label className="input-label">E-Mail-Adresse</label>
                          <input
                            className={`form-control ${
                              errors.email ? "is-invalid" : ""
                            }`}
                            type="text"
                            id="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="user@example.com"
                          />
                          {errors.email && (
                            <div className="invalid-feedback">
                              {errors.email}
                            </div>
                          )}
                        </div>
                        <div className="form-group">
                          <label className="input-label">Passwort</label>
                          <div className="password-input">
                            <input
                              className={`form-control ${
                                errors.password ? "is-invalid" : ""
                              }`}
                              type={showPw ? "text" : "password"}
                              id="password"
                              value={formData.password}
                              onChange={handleInputChange}
                              placeholder="********"
                              style={{ paddingRight: "40px" }}
                            />
                            {errors.password && (
                              <div className="invalid-feedback">
                                {errors.password}
                              </div>
                            )}
                            <i
                              className={`eye-icon ${
                                showPw ? "fa fa-eye-slash" : "fa fa-eye"
                              }`}
                              onClick={handleTogglePwVisibility}
                              style={{
                                position: "absolute",
                                top: "216px",
                                right: "26px",
                                transform: "translateY(-50%)",
                              }}
                            ></i>
                          </div>
                        </div>
                        <div className="mb-10 form-group">
                          <div
                            className="xchat-checkbox-area"
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              backgroundColor: "white",
                              transition: "background-color 0.3s",
                            }}
                          >
                            <div>
                              <input
                                type="checkbox"
                                id="isKeepLogin"
                                name="isKeepLogin"
                                checked={formData.isKeepLogin}
                                onChange={handleInputChange}
                              />
                              <label
                                htmlFor="isKeepLogin"
                                style={{ paddingLeft: "10px" }}
                              >
                                Eingeloggt bleiben
                              </label>
                            </div>
                            <div className="right-content">
                              <a
                                href="/forgot"
                                style={{ marginLeft: "auto" }}
                                className="linkshover"
                              >
                                Passwort vergessen
                              </a>
                            </div>
                          </div>
                        </div>
                        <div className="form-group">
                          <button type="submit" className="xchat-btn-fill">
                            Einloggen
                          </button>
                        </div>
                      </form>
                    </div>
                    <div className="xchat-footer">
                      <p>
                        Sie haben kein Konto?
                        <Link
                          legacyBehavior
                          href="/auth/register"
                          as="/auth/register"
                          key="register"
                        >
                          <a className="switcher-text2 inline-text linkshover">
                            Registrieren
                          </a>
                        </Link>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

Home.getInitialProps = async () => {
  try {
    const res = await systemService.getConfigByKeys([
      "transparentLogo",
      "authBgImage",
    ]);
    return res.data;
  } catch (e) {
    return {};
  }
};

const mapStateToProps = (state: any) => ({
  authUser: state.auth.authUser,
});

Home.Layout = BlankWithFooterLayout;
export default connect(mapStateToProps)(Home);
