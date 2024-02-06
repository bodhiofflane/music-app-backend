import path from 'node:path';
import fs, { constants } from 'node:fs/promises';

import fileUpload, { UploadedFile } from 'express-fileupload';
import mime from 'mime-types';
import { ruToLatService, spaceRemovalService } from './string.service';

export const saveImageToDirAndReturnUrlService = async (
  uploadedImage: UploadedFile | null,
  dir: 'artist' | 'album' | 'track',
  filename: string
): Promise<string | undefined> => {
  try {
    if (uploadedImage) {
      const imageExt = uploadedImage.mimetype;

      // Проверка на доступный тип
      if (
        imageExt !== mime.lookup('.png') &&
        imageExt !== mime.lookup('.jpeg') &&
        imageExt !== mime.lookup('.webp')
      ) {
        throw new Error(
          'Загруженное изображение должно быть .png, .jpeg, .jpg либо .webp'
        );
      }

      // Ограничиваю размер файла на 10 мб.
      if (uploadedImage.size > 10 * 1024 * 1024) {
        throw new Error(
          'Изображение слишком большее. Размер не должен превышать 10 MB'
        );
      }

      // Служебная переменная. На основе её значения будет создаваться каталог.
      let existDir: boolean;

      // Так вот работает модуль fs/promise.
      try {
        await fs.access(path.resolve('static', 'images', dir), constants.F_OK);
        existDir = true;
      } catch (error) {
        existDir = false;
      }

      // Создание директории на случай если её нет.
      if (!existDir) {
        await fs.mkdir(path.resolve('static', 'images', dir), {
          recursive: true,
        });
      }

      // Запись файла в директорию и возврат URL.
      await uploadedImage.mv(
        path.resolve(
          'static',
          'images',
          dir,
          filename + '.' + mime.extension(imageExt)
        )
      );
      return `/static/images/${dir}/${filename}.${mime.extension(imageExt)}`;
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
};

// Удалять трек после обновления ненужно. Метод .mv его перезаписывает.
export const saveAudioToDirAndReturnUrlService = async (
  uploadedAudio: UploadedFile | null,
  albumName: string,
  fileName: string
) => {
  try {
    if (!uploadedAudio || uploadedAudio.mimetype !== mime.lookup('.mp3')) {
      throw new Error('Неподходящий формат загруженного файла. Используйте .mp3');
    }
    if (uploadedAudio.size > 15 * 1042 * 1024) {
      throw new Error('Загруженный файл слишком большой. Не привышайте 15MB');
    }

    let existDir: boolean;
    try {
      await fs.access(path.resolve('static', 'audio', spaceRemovalService(albumName)), constants.F_OK);
      existDir = true;
    } catch (error) {
      existDir = false;
    }
    
    if (!existDir) {
      fs.mkdir(path.resolve('static', 'audio', spaceRemovalService(albumName)), {recursive: true});
    }

    await uploadedAudio.mv(path.resolve('static', 'audio', spaceRemovalService(albumName), fileName + '.mp3'));

    return `/static/audio/${spaceRemovalService(albumName)}/${fileName}.mp3`;

  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      throw new Error(error.message);
    };
  }
};

export const saveTrackAndReturnUrlService = async (
  audioFile: UploadedFile | null,
  artistName: string,
  trackName: string
) => {
  try {
    if (!audioFile || audioFile.mimetype  !== mime.lookup('.mp3')) {
      throw new Error('Неподходящий формат загруженного файла. Используйте .mp3');
    }
    if (audioFile.size > 15 * 1042 * 1024) {
      throw new Error('Загруженный файл слишком большой. Не привышайте 15MB');
    }

    console.log(mime.extension(audioFile.mimetype));
    console.log(audioFile.mimetype);

    const relativePathToSave = path.join('static', 'audio');
    //const fileExt = '.' + mime.extension(audioFile.mimetype); Почему-то дает не .mpeg, хотя я ожидал .mp3. Пока заткну глухим кодом. 
    const fileExt = '.mp3';
    const fileName = ruToLatService(artistName + '-' + trackName + fileExt);
    // const fullPathToSave = path.resolve(relativePathToSave, fileName);

    let isExistDir: boolean;
    try {
      await fs.access(path.resolve(relativePathToSave), constants.F_OK);
      isExistDir = true;
    } catch (error) {
      isExistDir = false;
    }

    if (!isExistDir) {
      await fs.mkdir(path.resolve(relativePathToSave), {recursive: true});
    }

    await audioFile.mv(path.resolve(relativePathToSave, fileName));

    return '/' + path.join(relativePathToSave, fileName);
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      throw new Error(error.message);
    };
  }
};

export const selectFileFromRecivedFilesService = (
  files: fileUpload.FileArray | null | undefined,
  fileName: string
) => {
  const file =
    files && files[fileName] && !Array.isArray(files[fileName])
      ? (files[fileName] as fileUpload.UploadedFile)
      : null;
  return file;
};

export const deleteFileService = async (pathToDelete: string) => {
  const pathToFile = pathToDelete.substring(1);
  try {
    await fs.unlink(path.resolve(pathToFile));
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      throw new Error('Не удалось удалить файл');
    }
  }
};