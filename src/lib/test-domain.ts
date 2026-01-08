import { extractBaseDomain } from "./sub";

// Tambahkan ini di file tempat fungsi extractBaseDomain berada
export function runDomainTests() {
  const testCases = [
    { input: "andonpro.vercel.app", expected: "andonpro.vercel.app" },
    { input: "mytenant.andonpro.vercel.app", expected: "andonpro.vercel.app" },
    { input: "branch-name---andonpro.vercel.app", expected: "vercel.app" },
    { input: "andonpro.com", expected: "andonpro.com" },
    { input: "sub.andonpro.com", expected: "andonpro.com" },
  ];

  return testCases.map(test => {
    const result = extractBaseDomain(test.input);
    return {
      ...test,
      result,
      isPass: result === test.expected
    };
  });
}