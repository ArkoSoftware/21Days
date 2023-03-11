
export async function SendNotification(title,body,user) {
    await fetch(
      "https://us-central1-days-46745.cloudfunctions.net/sendNotification",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title:title,
          body:body,
          user:user
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }