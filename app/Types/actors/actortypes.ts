import { Actor } from '../entitytypes'

export type SocialMediaArray = [{media: string, link: string}] | null;

export type ActorCreate = Omit<Actor, 'id' | 'img'>;

export type ActorUpdate = Omit<Actor, 'id' | 'img' | 'socmed'> & {
    socmed: {media: string, link: string}[];
}