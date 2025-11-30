import { actions, Sync } from "@engine";
import { Authentication, Requesting } from "@concepts";

// Register user
export const RegisterRequest: Sync = ({ request, username, password }) => ({
  when: actions(
    [Requesting.request, { path: "/Authentication/register", username, password }, { request }],
  ),
  then: actions([Authentication.register, { username, password }]),
});

export const RegisterResponse: Sync = ({ request, user }) => ({
  when: actions(
    [Requesting.request, { path: "/Authentication/register" }, { request }],
    [Authentication.register, {}, { user }],
  ),
  then: actions([Requesting.respond, { request, user }]),
});

export const RegisterErrorResponse: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/Authentication/register" }, { request }],
    [Authentication.register, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

// Authenticate user
export const AuthenticateRequest: Sync = ({ request, username, password }) => ({
  when: actions(
    [Requesting.request, { path: "/Authentication/authenticate", username, password }, { request }],
  ),
  then: actions([Authentication.authenticate, { username, password }]),
});

export const AuthenticateResponse: Sync = ({ request, user }) => ({
  when: actions(
    [Requesting.request, { path: "/Authentication/authenticate" }, { request }],
    [Authentication.authenticate, {}, { user }],
  ),
  then: actions([Requesting.respond, { request, user }]),
});

export const AuthenticateErrorResponse: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/Authentication/authenticate" }, { request }],
    [Authentication.authenticate, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

// Create session
export const CreateSessionRequest: Sync = ({ request, user }) => ({
  when: actions(
    [Requesting.request, { path: "/Authentication/createSession", user }, { request }],
  ),
  then: actions([Authentication.createSession, { user }]),
});

export const CreateSessionResponse: Sync = ({ request, token }) => ({
  when: actions(
    [Requesting.request, { path: "/Authentication/createSession" }, { request }],
    [Authentication.createSession, {}, { token }],
  ),
  then: actions([Requesting.respond, { request, token }]),
});

export const CreateSessionErrorResponse: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/Authentication/createSession" }, { request }],
    [Authentication.createSession, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

// Validate session
export const ValidateSessionRequest: Sync = ({ request, token }) => ({
  when: actions(
    [Requesting.request, { path: "/Authentication/validateSession", token }, { request }],
  ),
  then: actions([Authentication.validateSession, { token }]),
});

export const ValidateSessionResponse: Sync = ({ request, user }) => ({
  when: actions(
    [Requesting.request, { path: "/Authentication/validateSession" }, { request }],
    [Authentication.validateSession, {}, { user }],
  ),
  then: actions([Requesting.respond, { request, user }]),
});

export const ValidateSessionErrorResponse: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/Authentication/validateSession" }, { request }],
    [Authentication.validateSession, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

