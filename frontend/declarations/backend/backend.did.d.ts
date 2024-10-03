import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface _SERVICE {
  'addHighScore' : ActorMethod<[string, bigint], undefined>,
  'getHighScores' : ActorMethod<[], Array<[string, bigint]>>,
  'getProgress' : ActorMethod<[string], [] | [bigint]>,
  'saveProgress' : ActorMethod<[string, bigint], undefined>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
