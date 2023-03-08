import "./style.css";
import * as THREE from "three";

//canvas
const canvas = document.querySelector("#webgl");

//シーン
const scene = new THREE.Scene();

//背景用のテクスチャ
const textureLoader = new THREE.TextureLoader();
const bgTexture = textureLoader.load("bg/bg.jpg");
scene.background = bgTexture; //基本的には追加はaddだが背景はbackgroundで追記する

//サイズ
const sizes = {
  width: innerWidth,
  height: innerHeight,
};

//カメラ
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  1000
);

//レンダラー
//レンダー先を明示的にcanvasの中に書くことを定義している
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
//粗さを軽減するもの
renderer.setPixelRatio(window.devicePixelRatio);

//オブジェクトを作成
const boxGeometry = new THREE.BoxGeometry(5, 5, 5, 10);
const boxMateiral = new THREE.MeshNormalMaterial();
const box = new THREE.Mesh(boxGeometry, boxMateiral);

box.position.set(0, 0.5, -15);
box.rotation.set(1, 1, 0);

const torusGeometry = new THREE.TorusGeometry(8, 2, 16, 100);
const torusMateiral = new THREE.MeshNormalMaterial();
const torus = new THREE.Mesh(torusGeometry, torusMateiral);

torus.position.set(0, 1, 10);

scene.add(box, torus);

//線形補間でなめらかに移動させる
const lerp = (x, y, a) => {
  return (1 - a) * x + a * y;
};

const scalePercent = (start, end) => {
  return (scrollParcent - start) / (end - start);
};

const animationScripts = [];

animationScripts.push({
  start: 0,
  end: 40,
  set() {
    camera.lookAt(box.position); //カメラはどこを向いておいてほしいのかの宣言をする
    camera.position.set(0, 1, 10);
    box.position.z = lerp(-15, 2,scalePercent(0,40));
    torus.position.z = lerp(10, -20,scalePercent(0,40));
  },
});

animationScripts.push({
  start: 40,
  end: 60,
  set() {
    camera.lookAt(box.position); //カメラはどこを向いておいてほしいのかの宣言をする
    camera.position.set(0, 1, 10);
    box.rotation.z = lerp(1, Math.PI,scalePercent(40,60));
  },
});

animationScripts.push({
  start: 60,
  end: 80,
  set() {
    camera.lookAt(box.position); //カメラはどこを向いておいてほしいのかの宣言をする
    camera.position.x =  lerp(0, -15,scalePercent(60,80));
    camera.position.y =  lerp(1, 15,scalePercent(60,80));
    camera.position.z =  lerp(10, 25,scalePercent(60,80));  
  },
});

animationScripts.push({
  start: 60,
  end: 100,
  set() {
    camera.lookAt(box.position); //カメラはどこを向いておいてほしいのかの宣言をする
    box.rotation.x += 0.02
    box.rotation.y += 0.02

  },
});


//アニメーションを開始
const playScrollAnimation = () => {
  animationScripts.map((animation) => {
    if (scrollParcent >= animation.start && scrollParcent <= animation.end) {
      animation.set();
    }
  });
};

//スクロール率を取得----------------------------------------------------------------
let scrollParcent = 0;

document.querySelector("body").onscroll = () => {
  //スクロールの一番上からクライアントが見ている場所までを取得
  let documentheightX = document.documentElement.scrollTop;

  //スクロールの一番上からスクロールの一番下までを取得
  let documentheightL = document.documentElement.scrollHeight;
  //現在開いているブラウザの大きさを取得
  let clientheight = document.documentElement.clientHeight;

  scrollParcent = (documentheightX / (documentheightL - clientheight)) * 100;
};
//スクロール率を取得----------------------------------------------------------------

//アニメーション
const tick = () => {
  window.requestAnimationFrame(tick);
  playScrollAnimation();
  renderer.render(scene, camera);
};

tick();

//ブラウザのリサイズ操作
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(window.devicePixelRatio);
});

