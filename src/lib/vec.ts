
export type Vec2 = [number, number];

export const Vec = (function() {

    class Vec {
        x: number;
        y: number;

        constructor(x: number, y: number) {
            this.x = x;
            this.y = y;
        }

        reset(x: number, y: number): Vec {
            this.x = x;
            this.y = y;
            return this;
        }

        resize(len: number): Vec {
            return this.normalise().multiplyEq(len);
        }

        _resize(len: number): Vec {
            return new Vec(this.x, this.y).normalise().multiplyEq(len);
        }

        distance(target: Vec): number {
            return this.minusNew(target).magnitude();
        }

        direction(target: Vec): Vec {
            return this.minusNew(target).normalise();
        }

        projectNew(vec: Vec, distance: number): Vec {
            const newvec = new Vec(this.x, this.y);
            vec.clone();
            newvec.plusEq(vec.normaliseNew().multiplyEq(distance));
            return newvec;
        }

        directionNew(vec: Vec): Vec {
            return new Vec(this.x, this.y).minusNew(vec).normalise();
        }

        toString(decPlaces: number = 3): string {
            const scalar = Math.pow(10, decPlaces);
            return `[${Math.round(this.x * scalar) / scalar}, ${Math.round(this.y * scalar) / scalar}]`;
        }

        clone(): Vec {
            return new Vec(this.x, this.y);
        }

        copyTo(v: Vec): void {
            v.x = this.x;
            v.y = this.y;
        }

        copyFrom(v: Vec): void {
            this.x = v.x;
            this.y = v.y;
        }

        length(): number {
            return Math.sqrt((this.x * this.x) + (this.y * this.y));
        }

        magnitude(): number {
            return Math.sqrt((this.x * this.x) + (this.y * this.y));
        }

        magnitudeSquared(): number {
            return (this.x * this.x) + (this.y * this.y);
        }

        normalise(): Vec {
            const m = this.magnitude();
            this.x = this.x / m;
            this.y = this.y / m;
            return this;
        }

        normaliseNew(): Vec {
            return new Vec(this.x, this.y).normalise();
        }

        reverse(): Vec {
            this.x = -this.x;
            this.y = -this.y;
            return this;
        }

        plusEq(v: Vec): Vec {
            this.x += v.x;
            this.y += v.y;
            return this;
        }

        plusNew(v: Vec): Vec {
            return new Vec(this.x + v.x, this.y + v.y);
        }

        minusEq(v: Vec): Vec {
            this.x -= v.x;
            this.y -= v.y;
            return this;
        }

        minusNew(v: Vec): Vec {
            return new Vec(this.x - v.x, this.y - v.y);
        }

        multiplyEq(scalar: number): Vec {
            this.x *= scalar;
            this.y *= scalar;
            return this;
        }

        multiplyNew(scalar: number): Vec {
            const returnvec = this.clone();
            return returnvec.multiplyEq(scalar);
        }

        divideEq(scalar: number): Vec {
            this.x /= scalar;
            this.y /= scalar;
            return this;
        }

        divideNew(scalar: number): Vec {
            const returnvec = this.clone();
            return returnvec.divideEq(scalar);
        }

        dot(v: Vec): number {
            return (this.x * v.x) + (this.y * v.y);
        }

        angle(useRadians: boolean = false): number {
            return Math.atan2(this.y, this.x) * (useRadians ? 1 : VecConst.TO_DEGREES);
        }

        rotate(angle: number, useRadians: boolean = false): Vec {
            const cosRY = Math.cos(angle * (useRadians ? 1 : VecConst.TO_RADIANS));
            const sinRY = Math.sin(angle * (useRadians ? 1 : VecConst.TO_RADIANS));

            VecConst.temp.copyFrom(this);

            this.x = (VecConst.temp.x * cosRY) - (VecConst.temp.y * sinRY);
            this.y = (VecConst.temp.x * sinRY) + (VecConst.temp.y * cosRY);

            return this;
        }

        equals(v: Vec): boolean {
            return ((this.x === v.x) && (this.y === v.y));
        }

        isCloseTo(v: Vec, tolerance: number): boolean {
            if (this.equals(v)) return true;

            VecConst.temp.copyFrom(this);
            VecConst.temp.minusEq(v);

            return (VecConst.temp.magnitudeSquared() < tolerance * tolerance);
        }

        rotateAroundPoint(point: Vec, angle: number, useRadians: boolean = false): Vec {
            VecConst.temp.copyFrom(this);
            VecConst.temp.minusEq(point);
            VecConst.temp.rotate(angle, useRadians);
            VecConst.temp.plusEq(point);
            this.copyFrom(VecConst.temp);
            return this;
        }

        isMagLessThan(distance: number): boolean {
            return (this.magnitudeSquared() < distance * distance);
        }

        isMagGreaterThan(distance: number): boolean {
            return (this.magnitudeSquared() > distance * distance);
        }
    }

    const VecConst = {
        TO_DEGREES: 180 / Math.PI,
        TO_RADIANS: Math.PI / 180,
        temp: new Vec(0, 0)
    };

    return Vec;

})();
