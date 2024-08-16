import { nanoid } from 'nanoid'

import { type ExifType } from './type'

export function getMd5Sign(
  worker: Worker,
  file: File,
  options: {
    quality?: number
  } = {},
): Promise<ExifType> {
  return new Promise((resolve, reject) => {
    const id = nanoid(10)
    const fileReader = new FileReader()
    const blobSlice =
      File.prototype.slice ||
      //@ts-ignore
      File.prototype.mozSlice ||
      //@ts-ignore
      File.prototype.webkitSlice
    const _file = file
    const timeStart = new Date().getTime()
    fileReader.readAsArrayBuffer(blobSlice.call(_file, 0, _file.size))
    fileReader.onload = async function (e) {
      try {
        // picRunner = picRunner || new Pica({ idle: 30000 });
        // console.log("picRunner--->", picRunner);
        // const _picaFile = await picRunner.resizeBuffer({
        //   src: new Uint8Array(e.target.result.slice(0, e.target.result.Length))
        // });
        worker.postMessage(
          {
            id,
            payload: {
              input: e.target?.result,
              finish: true,
              ...options,
              name: file.name,
              type: file.type,
            },
          },
          [e.target?.result as ArrayBuffer],
        )
      } catch (error) {
        reject(error)
      }
    }
    fileReader.onerror = function () {
      reject(new Error('read file error'))
    }
    worker.onmessage = function (event) {
      console.log('total time: ', new Date().getTime() - timeStart)
      const { id: _id, err, payload } = event.data
      if (err) {
        console.log('err-->', err)
        reject(new Error(err))
        return
      }
      if (id === _id) {
        resolve(payload.output)
      }
    }
  })
}
