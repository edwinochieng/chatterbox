export const generateKeyPair = async () => {
  const keyPair = await window.crypto.subtle.generateKey(
    {
      name: "ECDH",
      namedCurve: "P-256", // Curve used for ECDH
    },
    true,
    ["deriveKey"] // Used for deriving a shared key
  );
  return keyPair;
};

export const storePrivateKeyInLocalStorage = async (keyPair: CryptoKeyPair) => {
  const exportedPrivateKey = await window.crypto.subtle.exportKey(
    "jwk",
    keyPair.privateKey
  );

  localStorage.setItem("privateKey", JSON.stringify(exportedPrivateKey));
};

export const getPrivateKeyFromLocalStorage = async () => {
  const privateKeyJwk = localStorage.getItem("privateKey");

  if (!privateKeyJwk) {
    return null; // Safeguard if no key is stored
  }

  const parsedPrivateKeyJwk = JSON.parse(privateKeyJwk);

  try {
    const privateKey = await window.crypto.subtle.importKey(
      "jwk",
      parsedPrivateKeyJwk,
      {
        name: "ECDH",
        namedCurve: "P-256",
      },
      true,
      ["deriveKey"]
    );
    return privateKey;
  } catch (error) {
    console.error("Error importing key", error);
    return null; // Return null if there's an error
  }
};

export const storePublicKeyInDatabase = async (
  keyPair: CryptoKeyPair,
  userId: string
) => {
  const exportedPublicKey = await window.crypto.subtle.exportKey(
    "jwk",
    keyPair.publicKey
  );

  const publicKeyString = JSON.stringify(exportedPublicKey);

  await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user/store-public-key`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ publicKey: publicKeyString, userId }),
  });
};

export const getPublicKey = async (publicKeyString: string) => {
  const parsedPublicKeyJwk = JSON.parse(publicKeyString);

  try {
    const publicKey = await window.crypto.subtle.importKey(
      "jwk",
      parsedPublicKeyJwk,
      {
        name: "ECDH",
        namedCurve: "P-256",
      },
      true,
      []
    );

    return publicKey;
  } catch (error) {
    console.error("Error importing key", error);
  }
};

export const deriveSharedKey = async (
  privateKey: CryptoKey,
  publicKey: CryptoKey
): Promise<CryptoKey> => {
  const sharedKey = await window.crypto.subtle.deriveKey(
    {
      name: "ECDH",
      public: publicKey,
    },
    privateKey,
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"]
  );
  return sharedKey;
};

export const encryptMessage = async (sharedKey: CryptoKey, message: string) => {
  const encodedMessage = new TextEncoder().encode(message);
  const iv = window.crypto.getRandomValues(new Uint8Array(12));

  const encryptedMessage = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    sharedKey,
    encodedMessage
  );

  return { encryptedMessage, iv }; // Return both encrypted message and IV
};

export const decryptMessage = async (
  sharedKey: CryptoKey,
  encryptedMessage: ArrayBuffer,
  iv: Uint8Array
) => {
  const decryptedMessage = await window.crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    sharedKey,
    encryptedMessage
  );

  return new TextDecoder().decode(decryptedMessage);
};
