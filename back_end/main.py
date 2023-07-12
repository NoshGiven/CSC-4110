import uvicorn
from fastapi import FastAPI, Request

import openai

openai.api_key = "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"

app = FastAPI()


@app.post("/answer")
async def answer_question(request: Request):
    data = await request.json()
    question = data['question']
    wiki_link = data.get('wiki_link', None)  # Get the wiki_link if provided, default to None

    messages = []
    system_msg = "Ask me anything!"
    messages.append({'role': 'system', 'content': system_msg})

    if wiki_link:
        system_msg += " Provide any specific context or ask a question about the topic."
        messages.append({'role': 'system', 'content': system_msg})
        messages.append({'role': 'user', 'content': wiki_link})

    messages.append({'role': 'user', 'content': question})

    response = openai.ChatCompletion.create(
        model='gpt-3.5-turbo',
        messages=messages,
        temperature=0.3,
        max_tokens=10
    )

    reply = response['choices'][0]['message']['content']
    messages.append({'role': 'assistant', 'content': reply})

    return {'answer': reply}

@app.get("/healthcheck")
async def healthcheck():
    status = 'OK'
    #chat_count = get_chat_count() #placeholder function, needs to be implemented
    details = {
        'status': status,
        'message': 'Healthy',
        #'additional_info':{'chat_count': chat_count}
    }
    return {'status': 'OK'}

if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8000)
