const fs = require("fs");
const path = require("path");

const VIDEO_EXTENTIONS =
  ".webm|.mkv|.flv|.flv|.vob|.ogv|.ogg|.drc|.gifv|.mng|.avi|.MTS|.M2TS|.TS|.mov|.qt|.wmv|.yuv|.rm|.rmvb|.viv|.asf|.amv|.mp4|.m4p|.m4v|.mpg|.mp2|.mpeg|.mpe|.mpv|.mpg|.mpeg|.m2v|.m4v|.svi|.3gp|.3g2|.mxf|.roq|.nsv|.flv|.f4v|.f4p|.f4a|.f4b";
const DOCUMENT_EXTENTIONS =
  ".0|.1st|.600|.602|.abw|.acl|.afp|.ami|.ans|.asc|.aww|.ccf|.csv|.cwk|.dbk|.dita|.doc|.docm|.docx|.dot|.dotx|.dwd|.egt|.epub|.ezw|.fdx|.ftm|.ftx|.gdoc|.html|.hwp|.hwpml|.log|.lwp|.mbp|.md|.me|.mcw|.mobi|.nb|.nb|.nbp|.neis|.nt|.nq|.odm|.odoc|.odt|.osheet|.ott|.omm|.pages|.pap|.pdax|.pdf|.quox|.radix-64|.rtf|.rpt|.sdw|.se|.stw|.sxw|.tex|.info|.troff|.txt|.uof|.uoml|.via|.wpd|.wps|.wpt|.wrd|.wrf|.wri|.xhtml|.xml|.xps|.xls|.xlsx|.ppt|.pptx";
const COMPRESSED_EXTENTIONS =
  ".a|.ar|.cpio|.shar|.LBR|.iso|.lbr|.mar|.sbx|.tar|.bz2|.F|.gz|.lz|.lz4|.lzma|.lzo|.rz|.sfark|.sz|.?Q?|.?Z?|.xz|.z|.Z|.zst|.??_|.7z|.s7z|.ace|.afa|.alz|.apk|.arc|.ark|.arc|.cdx|.arj|.b1|.b6z|.ba|.bh|.cab|.car|.cfs|.cpt|.dar|.dd|.dgc|.dmg|.ear|.gca|.ha|.hki|.ice|.jar|.kgb|.lzh|.lha|.lzx|.pak|.partimg|.paq6|.paq7|.paq8|.pea|.phar|.pim|.pit|.qda|.rar|.rk|.sda|.sea|.sen|.sfx|.shk|.sit|.sitx|.sqx|.tar.gz|.tgz|.tar.Z|.tar.bz2|.tbz2|.tar.lz|.tlz|.tar.xz|.txz|.tar.zst|.uc|.uc0|.uc2|.ucn|.ur2|.ue2|.uca|.uha|.war|.wim|.xar|.xp3|.yz1|.zip|.zipx|.zoo|.zpaq|.zz|.ecc|.ecsbx|.par.par2|.rev";

const AUDIO_EXTENTIONS =
  ".3gp|.aa|.aac|.aax|.act|.aiff|.alac|.amr|.ape|.au|.awb|.dss|.dvf|.flac|.gsm|.iklax|.ivs|.m4a|.m4b|.m4p|.mmf|.mp3|.mpc|.msv|.nmf|.ogg|.oga|.mogg|.opus|.org|.ra|.rm|.raw|.rf64|.sln|.tta|.voc|.vox|.wav|.wma|.wv|.webm|.8svx|.cda";

const IMAGE_EXTENTIONS =
  ".tif|.tiff|.bmp|.jpg|.jpeg|.gif|.png|.eps|.ico|.svg|.img";

const FOLDERS = {
  Document: DOCUMENT_EXTENTIONS,
  Compressed: COMPRESSED_EXTENTIONS,
  Video: VIDEO_EXTENTIONS,
  Audio: AUDIO_EXTENTIONS,
  Image: IMAGE_EXTENTIONS,
};

const getCatagory = (file) => {
  for (const folder of Object.keys(FOLDERS)) {
    for (const extention of FOLDERS[folder].split("|")) {
      if (file.endsWith(extention)) {
        return folder;
      }
    }
  }
  return null;
};

const ensureFolderCache = {};
const ensureFolder = (folder, parent) => {
  const folderPath = path.join(parent, folder);
  if (ensureFolderCache[folderPath]) {
    return;
  }
  if (!fs.existsSync(folderPath)) {
    console.log(`Creating folder ${folder}`);
    fs.mkdirSync(folderPath);
  }
  ensureFolderCache[folderPath] = true;
};

const moveFile = (oldPath, newPath) => {
  fs.renameSync(oldPath, newPath);
};

const organizeFile = (file, parent) => {
  console.log(`Organizing file ${file}`);
  const catagory = getCatagory(file);
  const filePath = path.join(parent, file);
  if (catagory) {
    ensureFolder(catagory, parent);
    const newPath = path.join(parent, catagory, file);
    moveFile(filePath, newPath);
    console.log(`Moved file ${file} to ${catagory} folder`);
    return true;
  } else {
    console.log(fs.statSync(filePath));
    console.log(`Cannot catagorize ${file}`);
    return false;
  }
};

const organizeFiles = (dir) => {
  console.log(`Starting to organize files in ${dir}`);
  return new Promise((resolve, reject) => {
    fs.readdir(dir, {}, (err, files) => {
      if (err) {
        reject(err);
        return;
      }
      let count = 0;
      files
        .filter((file) => fs.statSync(path.join(dir, file)).isFile())
        .forEach((file) => {
          count += organizeFile(file, dir) ? 1 : 0;
        });
      resolve(count);
    });
  });
};

module.exports = organizeFiles;
