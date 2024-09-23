
import { quadtree } from 'd3-quadtree';

const WIDTH = 256;

export default function collide() {
  let nodes = [];
  const force = alpha => {
    const tree = quadtree(
      nodes,
      d => d.x,
      d => d.y
    );

    nodes.forEach(node => {
      // console.log('measure:', node.measured.width);

      const r = WIDTH / 2;
      const nx1 = node.x - r;
      const nx2 = node.x + r;
      const ny1 = node.y - r;
      const ny2 = node.y + r;

      tree.visit((quad, x1, y1, x2, y2) => {
        if (!quad.length) {
          do {
            if (quad.data !== node) {
              if (quad.data.width) console.log('quad:', quad.data.width);
              const r2 = WIDTH / 2 + quad.data.width / 2;
              let x = node.x - quad.data.x;
              let y = node.y - quad.data.y;
              let l = Math.hypot(x, y);

              if (l < r2) {
                l = ((l - r2) / l) * alpha;
                node.x -= x *= l;
                node.y -= y *= l;
                quad.data.x += x;
                quad.data.y += y;
              }
            }
            quad = quad.next;
          } while (quad);
        }

        return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
      });
    });
  };

  force.initialize = newNodes => (nodes = newNodes);

  return force;
}
