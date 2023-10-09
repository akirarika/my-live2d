// const cubismModel =
//   "https://cdn.jsdelivr.net/gh/Eikanya/Live2d-model/%E7%A2%A7%E8%93%9D%E8%88%AA%E7%BA%BF%20Azue%20Lane/Azue%20Lane(JP)/lafei_4/lafei_4.model3.json";
// const cubismModel = "./models/2023.1.18/2023.1.18.model3.json";
const cubismModel = "./models/default/Kecream.model3.json";

(function main() {
  const params = new URL(location.href).searchParams;

  const rectRaw = document.querySelector("body").getBoundingClientRect();
  // in order to avoid blurring images in high dpi devices, the canvas size is enlarged by 2 times, and then reduced by 2 times during display
  const ratio = Number(params.get("dpi")) || window.devicePixelRatio || 1;
  const rect = {
    width: rectRaw.width * ratio,
    height: rectRaw.height * ratio,
  };

  const canvas = document.getElementById("canvas");
  canvas.style.setProperty("transform", "scale(" + rectRaw.height / rect.height + ")");

  const app = new PIXI.Application({
    view: canvas,
    autoStart: true,
    // resizeTo: window,
    backgroundAlpha: 0,
    width: rect.width,
    height: rect.height,
  });

  PIXI.live2d.Live2DModel.from(cubismModel).then((model) => {
    const scale = Number(params.get("scale")) || 0.45;
    model.width = model.width * scale;
    model.height = model.height * scale;

    model.motion("Init");

    canvas.style.setProperty("opacity", params.get("opacity") || "1");

    app.stage.addChild(model);

    if (params.get("top") === null) {
      if (params.get("bottom") !== null) {
        model.y = 0 - (model.height - rect.height - Number(params.get("bottom")) * ratio);
      }
    } else {
      model.y = Number(params.get("top")) * ratio || 0;
    }
    if (params.get("left") === null) {
      if (params.get("right") !== null) {
        model.x = 0 - (model.width - rect.width + Number(params.get("right")) * ratio);
      } else {
        model.x = rect.width / 2 - model.width / 2;
      }
    } else {
      if (params.get("left") === "center") {
        model.x = rect.width / 2 - model.width / 2;
      } else {
        model.x = Number(params.get("left")) * ratio || 0;
      }
    }
  });
})();
