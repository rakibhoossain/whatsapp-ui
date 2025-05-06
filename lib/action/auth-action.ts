
"use server"

export async function loginAction({userId, token}: {userId: string, token: string}) {

    const myHeaders = new Headers();
    myHeaders.append("apiKey", "user-test-apikey-client");
    myHeaders.append("Authorization", "Basic NjBmZTI3NjktZWZiNC1jZTMzLTAwMDgtZTRjMjc1YmRiZjVkOktxWmxTRVlSVUZjWHRTNkx4akpNbmZ6cjV1bUJtQ0UtZXM4bXlydVk=");
    
    const requestOptions = {
      method: "GET",
      headers: myHeaders,
    };
    
    const res = await fetch("http://127.0.0.1:3000/app/login", requestOptions)
    
    const data = await res.json()

    return data

}


export async function getContactsAction({userId, token}: {userId: string, token: string}) {

    const myHeaders = new Headers();
    myHeaders.append("apiKey", "user-test-apikey-client");
    myHeaders.append("Authorization", "Basic NjBmZTI3NjktZWZiNC1jZTMzLTAwMDgtZTRjMjc1YmRiZjVkOktxWmxTRVlSVUZjWHRTNkx4akpNbmZ6cjV1bUJtQ0UtZXM4bXlydVk=");
    
    const requestOptions = {
      method: "GET",
      headers: myHeaders,
    };
    
    const res = await fetch("http://127.0.0.1:3000/user/my/contacts", requestOptions)
    
    const data = await res.json()

    return data?.results?.data || []

}