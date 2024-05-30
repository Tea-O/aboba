import {combine, createEffect, createEvent, createStore, restore, sample} from 'effector'

interface User {
    id: number;
    name: string;
    surname: string;
}

interface Login {
    user: string;
    password: string;

}

export const postUser = async (login: Login) => {
    // console.log("asda")
    const res = await fetch(
        'http://localhost:3000/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(login),
        }
    );
    return res.json();

}

export const userChange = createEvent<string>();
export const passwordChange = createEvent<string>();

export const $userInput = restore(userChange,'');
export const $password = restore(passwordChange,'');
export const $user = createStore<User | null>(null);
// export const update = createEvent<User>;

export const getUsersFx = createEffect<Login, User>(
    postUser
);

export const buttonSubmit = createEvent();

sample({
    clock: buttonSubmit,
    source: [$userInput, $password],
    fn: ([user, password]) => ({user, password}),
    target: getUsersFx,
    filter: () => !getUsersFx.pending,
})
sample({
    clock: getUsersFx.doneData,
    target: $user
})