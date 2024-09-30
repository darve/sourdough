
type SpringPosition = {
  target: number;
  current: number;
}

class Spring {

  current: number = 0;
  target: number = 0;
  position: SpringPosition;

  acceleration: number;
  stiffness: number;
  velocity: number;
  friction: number;
  threshold: number;
  dt: number;
  eps: number;
  
  constructor(position:number, stiffness:number, friction:number, threshold:number, dt:number) {
    
    this.position = {
      current: position,
      target: position
    };

    this.velocity = 0;
    this.acceleration = 0;
    this.stiffness = stiffness || 5;
    this.friction  = friction  || 50;
    this.threshold = threshold || 0.04;
    this.dt = dt || 1 / 30;
    this.eps = 0.01;
  }

  setPosition(position:number) {
    this.position = {
      current: position,
      target: position
    };
  }

  setTarget(position: number) {
    if (position) {
      this.position.target = position;
    }
  }

  getPosition() {
    return this.position.current;
  }

  update() {
    
    const { eps } = this;

    var smallerThanEps = [
      this.position.current - this.position.target,
      this.acceleration,
      this.velocity
    ].reduce(function(memo, value) {
      return memo && (Math.abs(value) < eps);
    }, true);

    if (!smallerThanEps) {
      var dist = this.position.target - this.position.current;
      this.acceleration = this.stiffness * dist - this.friction * this.velocity;
      this.velocity += this.acceleration * this.dt;
      this.position.current += this.velocity * this.dt;
    }
  }
}

export default Spring;