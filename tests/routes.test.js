import { describe, expect, it } from "vitest";
import {
  getRepositoryFromLocation,
  getUsernameFromLocation,
  repositoryRoute,
  userRoute,
} from "../src/js/utils/routes.js";

describe("routes", () => {
  it("creates encoded pretty routes", () => {
    expect(userRoute("DesbravadorSoftware")).toBe("/users/DesbravadorSoftware");
    expect(repositoryRoute("DesbravadorSoftware", "my repo")).toBe(
      "/repositories/DesbravadorSoftware/my%20repo"
    );
  });

  it("reads username from a pretty route", () => {
    expect(
      getUsernameFromLocation({
        pathname: "/users/DesbravadorSoftware",
        search: "",
      })
    ).toBe("DesbravadorSoftware");
  });

  it("supports query-string fallback when opening the html file directly", () => {
    expect(
      getUsernameFromLocation({
        pathname: "/user.html",
        search: "?username=DesbravadorSoftware",
      })
    ).toBe("DesbravadorSoftware");
    expect(
      getRepositoryFromLocation({
        pathname: "/repository.html",
        search: "?owner=facebook&repository=react",
      })
    ).toEqual({ owner: "facebook", repository: "react" });
  });
});
