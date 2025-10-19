import { Actor } from '../entitytypes'

export type SocialMediaArray = [{media: string, link: string}] | null;

export type CreateActor = Omit<Actor, 'id' | 'img'>;

export type UpdateActor = Omit<Actor, 'id' | 'img' | 'socmed'> & {
    socmed: {media: string, link: string}[];
}