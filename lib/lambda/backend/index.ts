export const handler = async (event: any = {}): Promise<any> => {
    console.log(event)
    return {
        statusCode: 200, 
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(event)
    }
}