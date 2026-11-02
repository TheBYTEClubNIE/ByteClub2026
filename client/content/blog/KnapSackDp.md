---
category: dsa
date: 2026-11-02
author: Your Name
---
# 🎒 Understanding the 0/1 Knapsack Problem Using Dynamic Programming

Dynamic Programming (DP) is one of the most important concepts in Data Structures and Algorithms. One of the classic problems used to understand DP is the **0/1 Knapsack Problem**.

In this blog, we'll understand:

- What the Knapsack Problem is
- Why Dynamic Programming is useful
- The recursive approach
- The DP approach
- How to build the DP table
- Space optimization
- Java implementation
- Time and space complexity

---

## 📌 What is the 0/1 Knapsack Problem?

Imagine that you have a knapsack with a limited capacity.

You are given multiple items, where every item has:

- A **weight**
- A **value**

Your goal is to select items such that:

1. The total weight does not exceed the capacity.
2. The total value is maximum.

### Example

Suppose we have:

| Item | Weight | Value |
|------|--------|-------|
| 1 | 1 kg | 6 |
| 2 | 2 kg | 10 |
| 3 | 3 kg | 12 |

Knapsack Capacity = **5 kg**

We need to select items with the **maximum possible value** without exceeding 5 kg.

The best choice is:

- Item 2 → Weight = 2, Value = 10
- Item 3 → Weight = 3, Value = 12

Total Weight = **5 kg**  
Total Value = **22**

✅ **Answer = 22**

---

## 🤔 Why is it called 0/1 Knapsack?

For every item, we have only two choices:

- **0 → Don't take the item**
- **1 → Take the item**

We cannot take an item multiple times.

For example:

```text
Item 1 → Take once or don't take
Item 2 → Take once or don't take
Item 3 → Take once or don't take
```

This is different from the **Unbounded Knapsack Problem**, where an item can be selected multiple times.

---

## 🧠 The Main Idea

For every item, we have two choices.

### Choice 1: Don't take the item

If we don't take the current item, the answer remains:

```text
dp[i - 1][capacity]
```

### Choice 2: Take the item

We can only take the item if:

```text
weight[i] <= capacity
```

Then:

```text
value[i] + dp[i - 1][capacity - weight[i]]
```

So the final answer is:

```text
dp[i][capacity] = max(
    don't take,
    take
)
```

---

## 🔁 Recursive Thinking

Let's define:

```text
knapsack(index, capacity)
```

This represents:

> The maximum value we can obtain using items from `0` to `index` with the given remaining capacity.

For every item:

### Don't Take

```text
knapsack(index - 1, capacity)
```

### Take

If the item's weight is less than or equal to the capacity:

```text
value[index] +
knapsack(index - 1, capacity - weight[index])
```

Therefore:

```text
knapsack(index, capacity) =
max(
    knapsack(index - 1, capacity),
    value[index] + knapsack(index - 1, capacity - weight[index])
)
```

---

## 🧩 Why Recursion Alone is Slow

Let's consider the recursive tree.

```text
                 Item 3
                /      \
          Don't Take   Take
             /           \
         Item 2         Item 2
         /    \         /    \
```

The same states can be calculated multiple times.

For example:

```text
knapsack(2, 5)
knapsack(2, 3)
knapsack(1, 3)
```

Some states may appear repeatedly.

This creates **overlapping subproblems**.

That is where **Dynamic Programming** helps us.

---

## 📊 Dynamic Programming Approach

We create a DP table:

```text
dp[i][j]
```

Where:

- `i` → Number of items considered
- `j` → Current knapsack capacity

`dp[i][j]` represents:

> The maximum value obtained using the first `i` items with capacity `j`.

### 🏗️ DP Table

Suppose:

```text
Weights = [1, 2, 3]
Values  = [6, 10, 12]

Capacity = 5
```

Our DP table will look like:

```text
        Capacity
        0  1  2  3  4  5
Item 0  0  0  0  0  0  0
Item 1
Item 2
Item 3
```

The first row contains `0` because if there are no items, the maximum value is always `0`.

Similarly:

```text
dp[i][0] = 0
```

Because a knapsack with capacity `0` cannot hold anything.

---

## ⚙️ DP Transition

For every item, we have two cases.

### Case 1: Current item is too heavy

If:

```text
weight[i - 1] > capacity
```

We cannot take the item.

Therefore:

```text
dp[i][j] = dp[i - 1][j]
```

### Case 2: Current item can fit

If:

```text
weight[i - 1] <= j
```

We have two choices.

**Don't Take**

```text
dp[i - 1][j]
```

**Take**

```text
value[i - 1] + dp[i - 1][j - weight[i - 1]]
```

Therefore:

```text
dp[i][j] = Math.max(
    dp[i - 1][j],
    value[i - 1] + dp[i - 1][j - weight[i - 1]]
);
```

---

## 💻 Java Implementation

```java
class Solution {
    public int knapsack(int[] weight, int[] value, int capacity) {
        int n = weight.length;

        int[][] dp = new int[n + 1][capacity + 1];

        for (int i = 1; i <= n; i++) {
            for (int j = 0; j <= capacity; j++) {

                if (weight[i - 1] <= j) {
                    dp[i][j] = Math.max(
                        dp[i - 1][j],
                        value[i - 1] + dp[i - 1][j - weight[i - 1]]
                    );
                } else {
                    dp[i][j] = dp[i - 1][j];
                }
            }
        }

        return dp[n][capacity];
    }
}
```

---

## 🔍 Understanding the Code

We create:

```java
int[][] dp = new int[n + 1][capacity + 1];
```

The extra row represents:

```text
0 items
```

The extra column represents:

```text
0 capacity
```

Then we iterate through every item:

```java
for (int i = 1; i <= n; i++)
```

And every possible capacity:

```java
for (int j = 0; j <= capacity; j++)
```

If the current item fits:

```java
weight[i - 1] <= j
```

We choose the maximum between taking and not taking it.

---

## 🚀 Space Optimized Solution

The 2D DP solution uses:

```text
O(N × W)
```

space.

But we can optimize it to:

```text
O(W)
```

because each row only depends on the previous row.

### Important ⚠️

For the **0/1 Knapsack Problem**, we must iterate **backwards**.

```java
for (int j = capacity; j >= weight[i]; j--)
```

### 💻 Optimized Java Code

```java
class Solution {
    public int knapsack(int[] weight, int[] value, int capacity) {
        int[] dp = new int[capacity + 1];

        for (int i = 0; i < weight.length; i++) {
            for (int j = capacity; j >= weight[i]; j--) {
                dp[j] = Math.max(
                    dp[j],
                    value[i] + dp[j - weight[i]]
                );
            }
        }

        return dp[capacity];
    }
}
```

---

## 🔄 Why Do We Iterate Backwards?

Consider:

```text
for (int j = capacity; j >= weight[i]; j--)
```

We go from right to left because every item can only be selected **once**.

If we iterate from left to right:

```text
0 → capacity
```

the same item could be used multiple times.

That would turn the problem into something similar to an **Unbounded Knapsack**.

So remember:

> 🔥 **0/1 Knapsack → Iterate Backwards**

> 🔥 **Unbounded Knapsack → Iterate Forwards**

---

## ⏱️ Complexity Analysis

Let:

- `N` = Number of items
- `W` = Knapsack capacity

### 2D Dynamic Programming

```text
Time Complexity:  O(N × W)
Space Complexity: O(N × W)
```

### Space Optimized DP

```text
Time Complexity:  O(N × W)
Space Complexity: O(W)
```

---

## 🎯 Key Takeaways

The most important idea in the 0/1 Knapsack Problem is:

```text
For every item:

        ┌─────────────┐
        │ Current Item│
        └──────┬──────┘
               │
        ┌──────▼──────┐
        │ Does it fit?│
        └──────┬──────┘
           │        │
          No       Yes
           │        │
           ▼        ▼
      Don't Take   Take or
                   Don't Take
                      │
                      ▼
                   Maximum
```

The recurrence is:

```text
dp[i][j] = max(
    dp[i - 1][j],
    value[i - 1] + dp[i - 1][j - weight[i - 1]]
)
```

---

## 🧠 Final Thoughts

The **0/1 Knapsack Problem** is one of the best problems for understanding Dynamic Programming because it teaches several important concepts:

- Recursion
- Overlapping subproblems
- Memoization
- Tabulation
- DP state definition
- Space optimization

Once you understand Knapsack DP, many other Dynamic Programming problems become easier to solve.

Some related problems include:

- Subset Sum
- Equal Sum Partition
- Target Sum
- Coin Change
- Rod Cutting
- Unbounded Knapsack

---
