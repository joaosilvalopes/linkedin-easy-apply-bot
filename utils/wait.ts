const MAX_WAIT_TIME = 2147483647;

/**
 * Wait a number of milliseconds, if the number of milliseconds to wait for is not provided it will block the program there
 * 
 * @param ms - number of milliseconds to wait for
 */
function wait(ms: number = MAX_WAIT_TIME): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default wait;
