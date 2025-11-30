import { actions, Sync } from "@engine";
import { Authentication, Requesting } from "@concepts";

// Register user
export const RegisterRequest: Sync = ({ request, username, password }) => ({
  when: actions(
    [Requesting.request, { path: "/Authentication/register", username, password }, { request }],
  ),
  then: actions([Authentication.register, { username, password }]),
});

export const RegisterResponse: Sync = ({ request, user, error }) => ({
  when: actions(
    [Requesting.request, { path: "/Authentication/register" }, { request }],
    [Authentication.register, {}, { user, error }],
  ),
  then: actions([Requesting.respond, { request, user, error }]),
});

// Authenticate user
export const AuthenticateRequest: Sync = ({ request, username, password }) => ({
  when: actions(
    [Requesting.request, { path: "/Authentication/authenticate", username, password }, { request }],
  ),
  then: actions([Authentication.authenticate, { username, password }]),
});

export const AuthenticateResponse: Sync = ({ request, user, error }) => ({
  when: actions(
    [Requesting.request, { path: "/Authentication/authenticate" }, { request }],
    [Authentication.authenticate, {}, { user, error }],
  ),
  then: actions([Requesting.respond, { request, user, error }]),
});

// Create session
export const CreateSessionRequest: Sync = ({ request, user }) => ({
  when: actions(
    [Requesting.request, { path: "/Authentication/createSession", user }, { request }],
  ),
  then: actions([Authentication.createSession, { user }]),
});

export const CreateSessionResponse: Sync = ({ request, token, error }) => ({
  when: actions(
    [Requesting.request, { path: "/Authentication/createSession" }, { request }],
    [Authentication.createSession, {}, { token, error }],
  ),
  then: actions([Requesting.respond, { request, token, error }]),
});

// Validate session
export const ValidateSessionRequest: Sync = ({ request, token }) => ({
  when: actions(
    [Requesting.request, { path: "/Authentication/validateSession", token }, { request }],
  ),
  then: actions([Authentication.validateSession, { token }]),
});

export const ValidateSessionResponse: Sync = ({ request, user, error }) => ({
  when: actions(
    [Requesting.request, { path: "/Authentication/validateSession" }, { request }],
    [Authentication.validateSession, {}, { user, error }],
  ),
  then: actions([Requesting.respond, { request, user, error }]),
});

