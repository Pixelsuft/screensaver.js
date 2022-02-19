const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

var width;
var height;

const args = get_query_arguments();
const show_fps = typeof args['fps'] == 'string' && (args['fps'].toLowerCase() == 'true' || args['fps'].toLowerCase() == '1');

const min_speed = 0.5;
const max_speed = 5.0;

const font_size = 30;
const font_family = 'Arial';
const font_str = get_font_str();

var speed;
var last_tick;
var current_timer;

var from_color;
var to_color;
var current_color;
var color_speed;

var is_fullscreen;

function get_query_arguments() {
  var query = location.search.substr(1).split("&");
  var parameters = {};

  for (var i = 0; i < query.length; i++) {
    var param = query[i].split("=");
    parameters[param[0]] = decodeURIComponent(param.slice(1).join("="));
  }

  return parameters;
}

function random_float(a, b) {
  return Math.random() * (b - a) + a;
}

function random_int(a, b) {
  return Math.round(Math.random() * (b - a)) + a;
}

function random_color() {
  return [
    random_int(0, 255),
    random_int(0, 255),
    random_int(0, 255)
  ];
}

function round_color(float_color) {
  return [
    Math.round(float_color[0]),
    Math.round(float_color[1]),
    Math.round(float_color[2])
  ]
}

function reverse_round_color(float_color) {
  return [
    Math.round(255 - float_color[0]),
    Math.round(255 - float_color[1]),
    Math.round(255 - float_color[2])
  ]
}

function random_speed() {
  return random_float(min_speed, max_speed);
}

function get_delta() {
  const now = Date.now();
  const _delta = (now - last_tick) / 1000;
  last_tick = now;
  return _delta;
}

function calc_speed() {
  color_speed[0] = (to_color[0] - from_color[0]) / speed;
  color_speed[1] = (to_color[1] - from_color[1]) / speed;
  color_speed[2] = (to_color[2] - from_color[2]) / speed;
}

function format_color(color) {
  return 'rgb(' + color[0] + ', ' + color[1] + ', ' + color[2] + ')';
}

function get_font_str() {
  return font_size + 'px ' + font_family;
}

function on_resize() {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
}

function on_update() {
  const delta = get_delta();
  current_timer += delta;
  current_color[0] += delta * color_speed[0];
  current_color[1] += delta * color_speed[1];
  current_color[2] += delta * color_speed[2];
  if (current_timer >= speed) {
    current_timer = 0.0;
    current_color = to_color;
    from_color = to_color;
    to_color = random_color();
    speed = random_speed();
    calc_speed();
  }
  ctx.fillStyle = format_color(round_color(current_color));
  ctx.fillRect(0, 0, width, height);
  if (show_fps) {
    ctx.font = font_str;
    ctx.textBaseline = 'top';
    ctx.fillStyle = format_color(reverse_round_color(current_color));
    ctx.fillText('FPS: ' + Math.round(1 / delta), 5, 5);
  }
  requestAnimationFrame(on_update);
}

function on_keydown() {
  if (!is_fullscreen)
    return;
  try {
    document.exitFullscreen();
    is_fullscreen = false;
    canvas.style.cursor = 'default';
  } catch (e) {
    is_fullscreen = false;
    canvas.style.cursor = 'default';
  }
}

function on_click() {
  if (is_fullscreen) {
    try {
      document.exitFullscreen();
      is_fullscreen = false;
      canvas.style.cursor = 'default';
    } catch (e) {
      is_fullscreen = false;
      canvas.style.cursor = 'default';
    }
  } else {
    const fn = document.body["requestFullScreen"] ||
      document.body["webkitRequestFullscreen"] ||
      document.body["mozRequestFullScreen"] ||
      document.body["msRequestFullScreen"];

    if (fn) {
      is_fullscreen = true;
      canvas.style.cursor = 'none';
      fn.call(document.body);
    }
  }
}

is_fullscreen = false;
ctx.imageSmoothingEnabled = false;
window.addEventListener('resize', on_resize);
window.addEventListener('keydown', on_keydown);
window.addEventListener('click', on_click);
on_resize();

speed = random_speed();
from_color = [0, 0, 0];
current_color = [0.0, 0.0, 0.0];
to_color = random_color();
color_speed = [0.0, 0.0, 0.0];
calc_speed();

canvas.style.display = 'block';
current_timer = 0.0;
last_tick = Date.now();
requestAnimationFrame(on_update);
