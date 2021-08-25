// Point class for objects in QuadTree
export class Point{
    constructor(x,y){
        this.x = x;
        this.y = y;
    }
}

// Rectangle Area Class
export class Rectangle{
    constructor(x,y,w,h){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    contains(point){
        return (
            point.x > this.x - this.w &&
            point.x < this.x + this.w &&
            point.y > this.y - this.h &&
            point.y < this.y + this.h);
    }

    intersects(range){
        return !(
            range.x - range.w > this.x + this.w  ||
            range.x + range.w < this.x - this.w  ||
            range.y - range.h > this.y + this.h  ||
            range.y + range.h < this.y - this.h );
    }
}

// QuadTree class
export class QuadTree{
    constructor(boundary, n){
        this.points = [];
        this.boundary = boundary;
        this.capacity = n;
        this.divided = false;
    }
    
    // subdivide when object count is higher then container limit
    subdivide(){
        const x = this.boundary.x;
        const y = this.boundary.y;
        const w = this.boundary.w;
        const h = this.boundary.h;

        let tR = new Rectangle(x+w*.5, y-h*.5, w*.5, h*.5);
        let tL = new Rectangle(x-w*.5, y-h*.5, w*.5, h*.5);
        let bR = new Rectangle(x+w*.5, y+h*.5, w*.5, h*.5);
        let bL = new Rectangle(x-w*.5, y+h*.5, w*.5, h*.5);

        this.qTree_tL = new QuadTree(tL, this.capacity);
        this.qTree_tR = new QuadTree(tR, this.capacity);
        this.qTree_bL = new QuadTree(bL, this.capacity);
        this.qTree_bR = new QuadTree(bR, this.capacity);
        this.divided = true;
    }

    // insert point into QuadTree
    insert(point){

        if (!this.boundary.contains(point)) {
            return false;
        }

        if (this.points.length < this.capacity){
            this.points.push(point);
            return true;
        } else {
            if (!this.divided){
                this.subdivide();
            }

            if (this.qTree_tL.insert(point)){
                return true;
            }
            else if (this.qTree_tR.insert(point)) {
                return true;
            }
            else if (this.qTree_bL.insert(point)) {
                return true;
            }
            else if (this.qTree_bR.insert(point)) {
                return true;  
            } 
        }
    }

    // Check child nodes
    query(range, found){
        if (!found){
            found = [];
        }
        if (!this.boundary.intersects(range)){
            return;
        } else {
            for (let p of this.points) {
                if (range.contains(p)) {
                    found.push(p);
                }
            }
            if (this.divided){
                this.qTree_tL.query(range, found);
                this.qTree_tR.query(range, found);
                this.qTree_bL.query(range, found);
                this.qTree_bR.query(range, found);
            }
        }
        return found;
        // console.log(found);
    }

    // debug draw
    show(canvas, ctx){

        const x = this.boundary.x;
        const y = this.boundary.y;
        const w = this.boundary.w;
        const h = this.boundary.h;
        
        ctx.lineWidth = 1;
        ctx.rectMode = 'center';
        ctx.strokeStyle = "Black";
        ctx.strokeRect(x-w*2*.5, y-h*2*.5, w*2, h*2);
        
        if (this.divided){
            this.qTree_tL.show(canvas, ctx);
            this.qTree_tR.show(canvas, ctx);
            this.qTree_bL.show(canvas, ctx);
            this.qTree_bR.show(canvas, ctx);
        }
        for (let p of this.points){
            ctx.lineWidth = 2;
            ctx.rectMode = 'center';
            ctx.strokeStyle = "Red";
            ctx.strokeRect(p.x, p.y, 2, 2);
        }
    }
}

