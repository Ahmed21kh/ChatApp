import { Injectable } from '@angular/core';
import { ref, Storage } from '@angular/fire/storage';
import { getDownloadURL, uploadBytes } from 'firebase/storage';
import { from } from 'rxjs';
import { Observable } from 'rxjs-compat';
import { switchMap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {

  constructor(private storage:Storage) { }

  uploadImage(image:File , path:string):Observable<string>{
   const StorageRef =ref(this.storage, path)
   const UploadTask = from(uploadBytes(StorageRef , image));
   return UploadTask.pipe(
    switchMap((result) => getDownloadURL(result.ref))
   );
  }
}
