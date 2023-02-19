import Navigation from "./components/Navigation";
import Logo from "./components/Logo";
import ImageLinkForm from "./components/ImageLinkForm";
import FaceRecognition from "./components/FaceRecognition";
import "./App.css";
import Rank from "./components/Rank";
import ParticlesBg from "particles-bg";
import { useCallback, useState } from "react";
// import Clarifai from "clarifai";
import Signin from "./components/auth/Signin";
import Signup from "./components/auth/Signup";

// const app = new Clarifai.App({
//   apiKey: "6ebcef4be1e64b178aaf15cbe110afa3",
// });

const App = () => {
  const [state, setState] = useState({
    input: "",
    box: {},
    route: "signin",
  });

  const handleChange = useCallback(
    (name) => (event) => {
      let value = event?.target?.value ?? event;

      setState((preState) => ({
        ...preState,
        box: {},
        [name]: value,
      }));
    },
    []
  );

  const calculateFaceLocation = useCallback((response) => {
    let width;
    let height;
    let clarifaiFace;
    response?.outputs?.[0]?.data?.regions?.forEach((item) => {
      clarifaiFace = item.region_info.bounding_box;
      const image = document.getElementById("inputImage");
      width = Number(image.width);
      height = Number(image.height);
    });
    return {
      leftCol: clarifaiFace?.left_col * width,
      topRow: clarifaiFace?.top_row * height,
      rightCol: width - clarifaiFace?.right_col * width,
      bottomRow: height - clarifaiFace?.bottom_row * height,
    };
  }, []);
  const onRouteChange = useCallback((route) => {
    setState((preState) => ({
      ...preState,
      route,
    }));
  }, []);

  const onSubmit = useCallback(() => {
    fetch(`http://localhost:4343/detect`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: state?.input }),
    })
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);

        setState((preState) => ({
          ...preState,
          box: calculateFaceLocation(data),
        }));
      })
      .catch((err) => console.log("error", err));
  }, [calculateFaceLocation, state?.input]);

  return (
    <div className="App">
      <ParticlesBg type="cobweb" bg={true} num={150} />

      {state?.route === "home" ? (
        <>
          <Navigation onRouteChange={onRouteChange} />
          <Logo />
          <Rank />
          <ImageLinkForm handleChange={handleChange} onSubmit={onSubmit} />
          <FaceRecognition box={state?.box} imageUrl={state?.input} />
        </>
      ) : state?.route === "signin" ? (
        <Signin onRouteChange={onRouteChange} />
      ) : (
        <Signup onRouteChange={onRouteChange} />
      )}
    </div>
  );
};

export default App;
