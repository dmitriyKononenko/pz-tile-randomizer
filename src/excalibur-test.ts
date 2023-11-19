import * as ex from "excalibur";

const game = async (canvas: HTMLCanvasElement) => {
  const game = new ex.Engine({
    canvasElement: canvas,
    width: 500,
    height: 500,
  });

  const isoMap = new ex.IsometricMap({
    pos: ex.vec(250, 250),
    renderFromTopOfGraphic: true,
    tileHeight: 64,
    tileWidth: 128,
    columns: 10,
    rows: 10,
  });

  const image = new ex.ImageSource("./tiles/walls_exterior_house_01.png");
  await image.load();

  const rougeLikeSpriteSheet = ex.SpriteSheet.fromImageSource({
    image,
    grid: {
      rows: 8,
      columns: 8,
      spriteHeight: 256,
      spriteWidth: 128,
    },
    spacing: {
      margin: {
        x: 0,
        y: 0,
      },
    },
  });

  // Create a tilemap
  const tilemap = new ex.TileMap({
    rows: 8,
    columns: 8,
    tileWidth: 128,
    tileHeight: 256,
  });

  // loop through tilemap cells
  tilemap.tiles.forEach((cell, i) => {
    const sprite = rougeLikeSpriteSheet.getSprite(i, 0);
    if (sprite) {
      cell.addGraphic(sprite);
    }
  });

  const tile1 = tilemap.tiles[5];
  const tile2 = tilemap.tiles[4];

  const tileCoord1 = ex.vec(0, 1);
  const tileCoord2 = ex.vec(0, 1);

  const p1 = isoMap.tileToWorld(tileCoord1);
  const p2 = isoMap.tileToWorld(tileCoord2);

  const part1 = new ex.Actor({
    x: p1.x,
    y: p1.y,
    name: "1",
  });

  const part2 = new ex.Actor({
    x: p2.x,
    y: p2.y,
    name: "2",
  });

  part1.graphics.add(tile1.getGraphics()[0]);
  part2.graphics.add(tile2.getGraphics()[0]);

  game.currentScene.add(isoMap);

  game.currentScene.add(part2);
  game.currentScene.add(part1);

  game.start();
};
