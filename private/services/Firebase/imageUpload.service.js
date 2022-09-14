const { getStorage, ref, uploadBytes, getDownloadURL } = require("firebase/storage");

const app = require("../../config/firebase.config");


const storage = getStorage(app);

async function uploadImage(file) {
	let imageUrl = ""
  
	try {
		const timestamp = Date.now();
		const name = file.originalname.replace(/ /g, "_").split(".")[0];
		const type = file.originalname.split(".")[1];
		const fileName = `${name}_${timestamp}.${type}`;

		const storageRef = ref(storage, `images/${fileName}`);
		console.log(file.buffer)
		
		const metadata = {
			contentType: file.mimetype,
		};
		
		await uploadBytes(storageRef, file.buffer, metadata).then(async (snapshot) => {
			await getDownloadURL(storageRef).then(url => {
				imageUrl = url;
			});
		});
		
		return imageUrl;
  } catch (error) {
		
		return "";
	}
}

module.exports = { uploadImage };
