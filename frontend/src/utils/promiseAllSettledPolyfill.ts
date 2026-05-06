if (typeof Promise.allSettled !== "function") {
  Promise.allSettled = function allSettled<T>(
    input: Iterable<T | PromiseLike<T>>,
  ): Promise<PromiseSettledResult<Awaited<T>>[]> {
    return Promise.all(
      Array.from(input, (item) =>
        Promise.resolve(item).then(
          (value) =>
            ({ status: "fulfilled", value }) as PromiseFulfilledResult<Awaited<T>>,
          (reason) =>
            ({ status: "rejected", reason }) as PromiseRejectedResult,
        ),
      ),
    );
  };
}

export {};
