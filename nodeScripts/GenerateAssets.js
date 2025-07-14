const texturePacker = require("free-tex-packer-core");
const fs = require("fs").promises;
const { join } = require("path");
const { exec } = require("child_process");

const srcPath = join(__dirname, "../src");
const assetsPath = join(srcPath, "assets");
const SLASH = process.platform === "win32" ? "\\" : "/";

const paths = {
  images: {
    path: join(assetsPath, "images"),
    name: "images",
  },
  audio: {
    path: join(assetsPath, "audio"),
    name: "audio",
  },
  uncompressed: {
    path: join(assetsPath, "uncompressed"),
    name: "uncompressed",
  },
  atlas: {
    path: join(assetsPath, "atlas"),
    name: "atlas",
  },
};

const options = {
  textureName: "",
  width: 4096,
  height: 4096,
  scale: 1,
  fixedSize: false,
  powerOfTwo: false,
  padding: 2,
  extrude: 1,
  allowRotation: true,
  detectIdentical: true,
  allowTrim: true,
  trimMode: "trim",
  alphaThreshold: 1,
  removeFileExtension: false,
  prependFolderName: true,
  textureFormat: "png",
  base64Export: false,
  packer: "MaxRectsPacker",
  packerMethod: "Smart",
  exporter: "Pixi",
  filter: "none",
};

async function runPrettierOn(file) {
  await exec(`prettier --write ${file}`);
}

function getFileNameWithExtension(path) {
  return path.slice(path.lastIndexOf("/") + 1, path.length);
}

function getFileNameWithoutExtension(path) {
  return path.slice(path.lastIndexOf("/") + 1, path.lastIndexOf("."));
}

function getFileExtensionFromPath(path) {
  return path.slice(path.lastIndexOf(".") + 1, path.length);
}

function isImage(filePath) {
  return /\.(gif|jpe?g|tiff?|png|webp|bmp)$/i.test(filePath);
}

function findFileWithExtension(files, extension) {
  for (const f of files) {
    if (getFileExtensionFromPath(f) === extension) return f;
  }
  return null;
}

function getShorterPath(path, fromFolder = "src") {
  const dir = path.split("/");
  const fileDir = dir.slice(dir.indexOf(fromFolder) + 1, dir.length);
  return fileDir.join("/");
}

async function getFolderContent(folderPath, shorterPath = true, shortenFromFolder = "src") {
  let result = [];
  const getFilesRecursively = async (path) => {
    const files = await fs.readdir(path);
    for (const f of files) {
      let newPath = join(path, f);
      const stat = await fs.stat(newPath);
      if (stat.isDirectory()) {
        await getFilesRecursively(newPath);
      } else {
        if (shorterPath) {
          newPath = getShorterPath(newPath, shortenFromFolder);
        }
        result.push(newPath);
      }
    }
  };
  await getFilesRecursively(folderPath);
  return result;
}

async function emptyAtlasFolder() {
  const { name, path } = paths.atlas;
  let files = await getFolderContent(path, true, name);
  if (files.length !== 0) {
    for (const f of files) {
      await fs.unlink(join(path, f));
    }
  }
}

async function generateSingleAtlas(data, name) {
  const assets = await Promise.all(
    data.map(async (key) => {
      const contents = await fs.readFile(join(paths.images.path, name, key));
      return { path: key, contents };
    })
  );
  options.textureName = name;
  texturePacker(assets, options, async (files, error) => {
    if (error) throw error;
    for (const item of files) {
      let itemPath = join(assetsPath, `atlas/${item.name}`);
      const ext = getFileExtensionFromPath(itemPath);
      if (ext === "json") {
        const path = itemPath.slice(0, itemPath.lastIndexOf("."));
        itemPath = `${path}.${ext}`;
      }
      await fs.appendFile(itemPath, item.buffer);
    }
  });
  const json = `${join(assetsPath, "atlas")}/${name}.json`;
  const png = `${join(assetsPath, "atlas")}/${name}.png`;
  return { name, json: getShorterPath(json, "src"), png: getShorterPath(png, "src") };
}

async function generateAtlases() {
  const { path } = paths.images;
  const atlases = [];
  try {
    const folders = await fs.readdir(path, "utf8");
    const atlasNames = [];
    for (const folder of folders) {
      const folderPath = join(path, folder);
      const stat = await fs.stat(folderPath);
      if (!stat.isDirectory()) continue;
      const folderContent = await getFolderContent(join(path, folder), true, folder);
      if (folderContent.length === 0) continue;
      const imageFiles = folderContent.filter((f) => isImage(f));
      atlasNames.push(folder);
      const atl = await generateSingleAtlas(imageFiles, folder);
      atlases.push(atl);
    }

    let str = `// @ts-nocheck\n\n`;
    for (const data of atlases) {
      const jsonPath = `'..${data.json.split("assets")[1]}'`;
      const pngPath = `'..${data.png.split("assets")[1]}?inline'`;
      str += `import ${data.name}Png from ${pngPath};\n`;
      str += `import ${data.name}Json from ${jsonPath};\n\n`;
    }

    str += "export const ATLASES = [";
    for (const data of atlases) {
      if (data.name !== "preload") {
        str += `{name: '${data.name}', img:${data.name}Png, json: ${data.name}Json,},`;
      }
    }
    str += "];\n\n";

    const file = join(__dirname, `..${SLASH}src${SLASH}assets${SLASH}assetsNames${SLASH}atlases.ts`);
    await fs.writeFile(file, str);
    await runPrettierOn(file);
  } catch (e) {
    console.log(e.message);
  }
}

async function generateUncompressedSprites() {
  const { path } = paths.uncompressed;
  console.log(path);
  try {
    const files = await getFolderContent(path, true);
    const images = files.filter((f) => isImage(f));
    let filesNamesAndPaths = [];
    if (images.length !== 0) {
      filesNamesAndPaths = images.map((el) => {
        const name = getFileNameWithExtension(el);
        return { name, path: el };
      });
    }

    let str = "// @ts-nocheck\n\n";

    for (const data of filesNamesAndPaths) {
      const path = `'..${SLASH}..${SLASH}assets${data.path.split("assets")[1]}'`;
      str += `import ${data.name.split(".")[0]} from ${path}; \n`;
    }

    str += "export const IMAGES = [";
    for (const data of filesNamesAndPaths) {
      str += `{name: '${data.name}', path:${data.name.split(".")[0]},},`;
    }
    str += "]";

    const file = join(__dirname, `..${SLASH}src${SLASH}assets${SLASH}assetsNames${SLASH}images.ts`);
    console.log(`..${SLASH}src${SLASH}assets${SLASH}assetsNames${SLASH}images.ts`);
    await fs.writeFile(file, str);
    await runPrettierOn(file);
  } catch (e) {
    console.log(e.message);
  }
}

async function generateAudioAssets() {
  const { path } = paths.audio;
  try {
    const files = await getFolderContent(path, true);
    let filesNamesAndPath = [];
    if (files.length !== 0) {
      filesNamesAndPath = files.map((el) => {
        const name = getFileNameWithoutExtension(el);
        return { name, path: el };
      });
    }

    let str = "// @ts-nocheck\n\n";

    for (const data of filesNamesAndPath) {
      const path = `'..${SLASH}assets${data.path.split("assets")[1]}'`;
      str += `import ${data.name.split(".")[0]} from ${path}; \n`;
    }

    str += "export const SOUNDS = [";
    for (const data of filesNamesAndPath) {
      str += `{name: '${data.name}', path:${data.name.split(".")[0]},},`;
    }
    str += "]";

    const file = join(__dirname, `..${SLASH}src${SLASH}assets${SLASH}assetsNames${SLASH}audio.ts`);
    // const data = `export const audioAssets = ${JSON.stringify(filesNamesAndPath)}`;
    await fs.writeFile(file, str);
    // await runPrettierOn(file);
  } catch (e) {
    console.log(e.message);
  }
}

async function start() {
  console.log("removing current sprite sheets");
  await emptyAtlasFolder();
  console.log("generating atlases");
  await generateAtlases();
  console.log("generating uncompressed sprites");
  await generateUncompressedSprites();
  console.log("generating audio assets");
  await generateAudioAssets();
  console.log("asset generation complete");
  console.log("running the game");
}

start();
