<template>
  <div class="fabric-canvas">
    <canvas id="canvas" width="400" height="400"></canvas>
  </div>
</template>

<script>
import { fabric } from 'fabric';
import DeckOfCards from '../tools/deck-of-cards';
import { distance } from '../tools/fabric-utils';

export default {
  name: 'FabricCanvas',
  data() {
    return {
      canvas: null,
      images: {},
      selected: null,
      overlapped: null,
      lastClick: 0
    }
  },
  mounted() {
    this.canvas = new fabric.Canvas('canvas', {
      backgroundColor: 'rgb(245,245,245)'
    });
    this.canvas.on('mouse:down', this.onClick);
    this.canvas.on('mouse:over', this.onMouseOver);
    this.canvas.on('mouse:out', this.onMouseOut);
    this.canvas.on('object:moving', this.onObjectMove);

    this.resize();
    window.addEventListener('resize', this.resize);
    
    this.loadImages();
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resize);
  },
  methods: {
    resize() {
      this.canvas.setWidth(this.$el.clientWidth);
      this.canvas.setHeight(this.$el.clientHeight);
      this.canvas.calcOffset();
    },
    onClick(options) {
      if (this.selected || options.target) {
        this.select(options.target);
        return;
      }

      if (!this.images.deckOfCards) return;
      
      var keys = Object.keys(this.images.deckOfCards);
      var randomCard = keys[ keys.length * Math.random() << 0];
      this.addCard(randomCard, options.e.clientX, options.e.clientY);
    },
    onMouseOver(options) {
      if (!options.target || options.target === this.selected) return;
      this.highlight(options.target, 1);
    },
    onMouseOut(options) {
      if (!options.target || options.target === this.selected) return;
      this.highlight(options.target, 0);
    },
    onObjectMove(options) {
      if (options.target !== this.selected) return;
      
      this.overlap(null);
      options.target.setCoords();
      this.canvas.forEachObject(this.checkForOverlap);
      this.canvas.renderAll();
    },
    checkForOverlap(target) {
      if (target === this.selected) return;
      if (!this.selected.intersectsWithObject(target)) return;
      if (this.overlapped && distance(this.overlapped, this.selected) < distance(target, this.selected)) return;
      this.overlap(target);
    },
    overlap(target) {
      if (this.overlapped) {
        this.highlight(this.overlapped, 0);
      }

      if (target) {
        this.highlight(target, 1);
      }

      this.overlapped = target;
      return;
    },
    select(target) {
      if(this.selected === target && Date.now() - this.lastClick < 200) {
        target.data.onDoubleClick();
      }

      if (this.selected) {
        this.highlight(this.selected, 0);
        this.overlap(null);
      }

      if (target) {
        this.highlight(target, 3);
        this.lastClick = Date.now();
      }

      this.selected = target;
      return;
    },
    highlight(target, width, render = true) {
      target.set('stroke', 'red');
      target.set('strokeWidth', width);
      if (render) this.canvas.renderAll();
    },
    addCard(card, x, y) {
      var imgInstance = new fabric.Image(this.images.deckOfCards['deck'], {
        left: x,
        top: y
      });

      imgInstance.setControlsVisibility({
         mt: false, 
         mb: false, 
         ml: false, 
         mr: false, 
         bl: false,
         br: false, 
         tl: false, 
         tr: false,
         mtr: true, 
      });

      imgInstance.data = {
        card: card,
        faceUp: false,
        onDoubleClick: () => {
          imgInstance.data.faceUp = !imgInstance.data.faceUp;
          imgInstance.setElement(imgInstance.data.faceUp ? this.images.deckOfCards[imgInstance.data.card] : this.images.deckOfCards['deck']);
        }
      }
      
      this.canvas.add(imgInstance);
    },
    async loadImages() {
      this.images.deckOfCards = await DeckOfCards();
    }
  }
}
</script>

<style>
.fabric-canvas {
  width: 100%;
  height: 100%;
}
</style>