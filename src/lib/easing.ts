
export type EasingFunction = (t: number, b: number, c: number, d: number) => number;
export type EasingMap = { [key: string]: EasingFunction };

export enum EasingType {
  EaseNone = "easeNone",
  EaseInQuad = "easeInQuad",
  EaseOutQuad = "easeOutQuad",
  EaseInOutQuad = "easeInOutQuad",
  EaseInCubic = "easeInCubic",
  EaseOutCubic = "easeOutCubic",
  EaseInOutCubic = "easeInOutCubic",
  EaseInQuart = "easeInQuart",
  EaseOutQuart = "easeOutQuart",
  EaseInOutQuart = "easeInOutQuart",
  EaseInQuint = "easeInQuint",
  EaseOutQuint = "easeOutQuint",
  EaseInOutQuint = "easeInOutQuint",
  EaseInSine = "easeInSine",
  EaseOutSine = "easeOutSine",
  EaseInOutSine = "easeInOutSine",
  EaseInExpo = "easeInExpo",
  EaseOutExpo = "easeOutExpo",
  EaseInOutExpo = "easeInOutExpo",
  EaseInCirc = "easeInCirc",
  EaseOutCirc = "easeOutCirc",
  EaseInOutCirc = "easeInOutCirc",
  EaseInElastic = "easeInElastic",
  EaseOutElastic = "easeOutElastic",
  EaseInOutElastic = "easeInOutElastic",
  EaseInBounce = "easeInBounce",
  EaseOutBounce = "easeOutBounce",
  EaseInOutBounce = "easeInOutBounce",
};

/**
 * Easing functions take the following form
 * t = current time (starts at 0)
 * b = the starting value of the property being tweened
 * c = the end value of the property being tweened
 * d = total time the tween should take
 */
export const EasingFunctions: EasingMap = {
  easeNone: function (t: number, b: number, c: number, d: number) {
    return (c * t) / d + b;
  },
  easeInQuad: function (t: number, b: number, c: number, d: number) {
    return c * (t /= d) * t + b;
  },
  easeOutQuad: function (t: number, b: number, c: number, d: number) {
    return -c * (t /= d) * (t - 2) + b;
  },
  easeInOutQuad: function (t: number, b: number, c: number, d: number) {
    if ((t /= d / 2) < 1) return (c / 2) * t * t + b;
    return (-c / 2) * (--t * (t - 2) - 1) + b;
  },
  easeInCubic: function (t: number, b: number, c: number, d: number) {
    return c * (t /= d) * t * t + b;
  },
  easeOutCubic: function (t: number, b: number, c: number, d: number) {
    return c * ((t = t / d - 1) * t * t + 1) + b;
  },
  easeInOutCubic: function (t: number, b: number, c: number, d: number) {
    if ((t /= d / 2) < 1) return (c / 2) * t * t * t + b;
    return (c / 2) * ((t -= 2) * t * t + 2) + b;
  },
  easeInQuart: function (t: number, b: number, c: number, d: number) {
    return c * (t /= d) * t * t * t + b;
  },
  easeOutQuart: function (t: number, b: number, c: number, d: number) {
    return -c * ((t = t / d - 1) * t * t * t - 1) + b;
  },
  easeInOutQuart: function (t: number, b: number, c: number, d: number) {
    if ((t /= d / 2) < 1) return (c / 2) * t * t * t * t + b;
    return (-c / 2) * ((t -= 2) * t * t * t - 2) + b;
  },
  easeInQuint: function (t: number, b: number, c: number, d: number) {
    return c * (t /= d) * t * t * t * t + b;
  },
  easeOutQuint: function (t: number, b: number, c: number, d: number) {
    return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
  },
  easeInOutQuint: function (t: number, b: number, c: number, d: number) {
    if ((t /= d / 2) < 1) return (c / 2) * t * t * t * t * t + b;
    return (c / 2) * ((t -= 2) * t * t * t * t + 2) + b;
  },
  easeInSine: function (t: number, b: number, c: number, d: number) {
    return -c * Math.cos((t / d) * (Math.PI / 2)) + c + b;
  },
  easeOutSine: function (t: number, b: number, c: number, d: number) {
    return c * Math.sin((t / d) * (Math.PI / 2)) + b;
  },
  easeInOutSine: function (t: number, b: number, c: number, d: number) {
    return (-c / 2) * (Math.cos((Math.PI * t) / d) - 1) + b;
  },
  easeInExpo: function (t: number, b: number, c: number, d: number) {
    return t === 0 ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
  },
  easeOutExpo: function (t: number, b: number, c: number, d: number) {
    return t === d ? b + c : c * (-Math.pow(2, (-10 * t) / d) + 1) + b;
  },
  easeInOutExpo: function (t: number, b: number, c: number, d: number) {
    if (t === 0) return b;
    if (t === d) return b + c;
    if ((t /= d / 2) < 1) return (c / 2) * Math.pow(2, 10 * (t - 1)) + b;
    return (c / 2) * (-Math.pow(2, -10 * --t) + 2) + b;
  },
  easeInCirc: function (t: number, b: number, c: number, d: number) {
    return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
  },
  easeOutCirc: function (t: number, b: number, c: number, d: number) {
    return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
  },
  easeInOutCirc: function (t: number, b: number, c: number, d: number) {
    if ((t /= d / 2) < 1) return (-c / 2) * (Math.sqrt(1 - t * t) - 1) + b;
    return (c / 2) * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
  },
    easeInElastic: function (t: number, b: number, c: number, d: number) {
      var s = 1.70158;
      var p = 0;
      var a = c;
      if (t === 0) return b;
      if ((t /= d) === 1) return b + c;
      if (!p) p = d * 0.3;
      if (a < Math.abs(c)) {
        a = c;
        s = p / 4;
      } else s = (p / (2 * Math.PI)) * Math.asin(c / a);
      return (
        -(
          a *
          Math.pow(2, 10 * (t -= 1)) *
          Math.sin(((t * d - s) * (2 * Math.PI)) / p)
        ) + b
      );
    },
    easeOutElastic: function (t: number, b: number, c: number, d: number) {
      var s = 1.70158;
      var p = 0;
      var a = c;
      if (t === 0) return b;
      if ((t /= d) === 1) return b + c;
      if (!p) p = d * 0.3;
      if (a < Math.abs(c)) {
        a = c;
        s = p / 4;
      } else s = (p / (2 * Math.PI)) * Math.asin(c / a);
      return (
        a * Math.pow(2, -10 * t) * Math.sin(((t * d - s) * (2 * Math.PI)) / p) +
        c +
        b
      );
    },
    easeInOutElastic: function (t: number, b: number, c: number, d: number) {
      var s = 1.70158;
      var p = 0;
      var a = c;
      if (t === 0) return b;
      if ((t /= d / 2) === 2) return b + c;
      if (!p) p = d * (0.3 * 1.5);
      if (a < Math.abs(c)) {
        a = c;
        s = p / 4;
      } else s = (p / (2 * Math.PI)) * Math.asin(c / a);
      if (t < 1)
        return (
          -0.5 *
            (a *
              Math.pow(2, 10 * (t -= 1)) *
              Math.sin(((t * d - s) * (2 * Math.PI)) / p)) +
          b
        );
      return (
        a *
          Math.pow(2, -10 * (t -= 1)) *
          Math.sin(((t * d - s) * (2 * Math.PI)) / p) *
          0.5 +
        c +
        b
      );
    },
    easeInBounce: function (t: number, b: number, c: number, d: number) {
      return c - this.easeOutBounce(d - t, 0, c, d) + b;
    },
    easeOutBounce: function (t: number, b: number, c: number, d: number) {
      if ((t /= d) < 1 / 2.75) {
        return c * (7.5625 * t * t) + b;
      } else if (t < 2 / 2.75) {
        return c * (7.5625 * (t -= 1.5 / 2.75) * t + 0.75) + b;
      } else if (t < 2.5 / 2.75) {
        return c * (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375) + b;
      } else {
        return c * (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375) + b;
      }
  },
  easeInOutBounce: function (t: number, b: number, c: number, d: number) {
      if (t < d/2) return this.easeInBounce (t*2, 0, c, d) * 0.5 + b;
      return this.easeOutBounce (t*2-d, 0, c, d) * 0.5 + c*0.5 + b;
    },
};
