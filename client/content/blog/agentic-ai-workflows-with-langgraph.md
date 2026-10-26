---
category: agentic-ai
date: 2026-10-26
author: Shreshth Baghel
---

# From Generative AI to Agentic AI: Understanding Workflows with LangGraph

> *"An LLM can write a job description. An agentic system can find the candidates, schedule the interviews, and ask a human to approve the final step. What changed?"*

Large Language Models (LLMs) can generate text, summarize documents, and write code. But generating a response is only one part of building an intelligent application. Modern AI systems are increasingly expected to plan tasks, use tools, remember state, and complete multi-step work.

In this article, we will cover:

1. What an agentic workflow is
2. How Agentic AI differs from Generative AI
3. What Generative AI is, and the frameworks used to build with it
4. The knowledge you need before you start
5. The core components of an agentic system
6. How agentic workflows operate
7. An introduction to LangGraph and its core concepts
8. A first stateful LLM workflow built with LangGraph and Groq

---

## 1. Introduction

Consider an HR recruitment system.

| System | What it can do |
|---|---|
| Basic chatbot | Draft a job description |
| Advanced application | Retrieve hiring policies, read candidate records, and check interview availability |
| Agentic workflow | Coordinate those steps, check the results, decide what comes next, and ask a human for approval |

The jump from **generating content** to **coordinating actions** is the central idea behind Agentic AI.

---

## 2. What Is an Agentic Workflow?

An **agentic workflow** is a process in which an AI model takes part in a sequence of decisions, actions, and intermediate results to achieve a defined goal.

A simple LLM call maps one input to one output. An agentic workflow can call several operations, use the results of earlier steps, and choose what to do next.

For example, an AI recruitment assistant might:

1. Receive a job requirement.
2. Identify the required skills.
3. Retrieve candidate information.
4. Rank the candidates.
5. Schedule interviews through a calendar tool.
6. Ask a human to approve before any email is sent.

| Characteristic | Basic LLM application | Agentic workflow |
|---|---|---|
| Purpose | Generate a response | Achieve a goal |
| Execution | One request-response cycle | Multiple coordinated steps |
| Decisions | Made within one response | Can decide the next step |
| Tools | Optional or absent | Often part of the workflow |
| State | Usually limited to one request | Shared across steps |
| Human involvement | Through prompts | Can include approval checkpoints |

> **Note:** Not every multi-step workflow is fully autonomous. A fixed sequence of steps is still a workflow. It becomes more agentic when the system chooses its actions based on the goal and the results it receives.

---

## 3. Agentic AI vs. Generative AI

Generative AI and Agentic AI are related, but they describe different things.

| | Generative AI | Agentic AI |
|---|---|---|
| **What it describes** | A **capability**: producing new content | A **behavior**: pursuing a goal through actions |
| **Typical output** | Text, code, images, audio | Completed tasks and results |
| **Needs** | A model | A model plus orchestration, state, and often tools |
| **Example** | Writes a job description | Writes the job description, posts it, and tracks applicants |

An agentic system uses Generative AI as one of its building blocks. The LLM provides reasoning and language, while the surrounding system provides memory, tools, and control flow.

### The Evolution of a Recruitment Assistant

| Stage | System | Description |
|---|---|---|
| 1 | **Generative AI chatbot** | Generates job descriptions and emails. It has no access to company data or external tools. |
| 2 | **RAG-based application** | Retrieves company documents, such as policies and role details, and uses them in its responses. |
| 3 | **Tool-augmented application** | Calls external tools, such as a calendar or email API, under the application's control. |
| 4 | **Agentic workflow** | Coordinates several operations toward a goal, checks results, handles errors, and requests approval where needed. |

These stages are a conceptual progression. Real systems often combine RAG, tools, and orchestration in different ways.

---

## 4. What Is Generative AI?

Generative AI refers to models that learn patterns from data and use them to create new outputs.

A Generative AI model can:

- Write a job description from a role specification.
- Summarize a long document.
- Generate Python code from a plain-English request.
- Extract structured data from unstructured text.

Here is a basic LLM call using Groq:

```python
from langchain_groq import ChatGroq

# Create a model client for Groq
model = ChatGroq(
    model="openai/gpt-oss-120b",
    temperature=0
)

# Send a prompt and print the response
response = model.invoke("Explain agentic AI in three sentences.")
print(response.content)
```

This is Generative AI, but not yet an agentic workflow. The model receives a prompt and returns text. No state, routing, or tool use is defined.

### Frameworks for Generative AI Applications

Different frameworks solve different problems.

| Framework / technology | Main role |
|---|---|
| **LangChain** | Connects models, prompts, tools, and other components |
| **LangGraph** | Orchestrates stateful, multi-step workflows as graphs |
| **LlamaIndex** | Connects LLMs to data through retrieval and indexing |
| **Hugging Face Transformers** | Works with pretrained models and transformer architectures |
| **Direct model APIs** | Call a model provider directly, without a larger framework |

Choose based on the main requirement: model inference, data retrieval, application composition, or workflow orchestration.

---

## 5. What You Should Know Before Learning Agentic AI

You do not need to master everything before starting. The following foundations will make the architecture much easier to follow.

| Area | Why it matters |
|---|---|
| **Python basics** | Workflow nodes and application logic are written in Python |
| **Functions and dictionaries** | Nodes receive and return data as dictionaries |
| **Type hints** | Define the structure of the data passed between steps |
| **APIs and HTTP requests** | Your code talks to LLM providers through APIs |
| **Prompting basics** | Prompts control what the model produces |
| **Control flow** | Conditions decide which step runs next |
| **Error handling** | Workflows need to handle failed or unexpected outputs |

---

## 6. Core Components of Agentic AI

Most agentic systems combine five components.

| Component | Role | Example |
|---|---|---|
| **Brain (LLM)** | Interprets instructions, generates content, and helps decide the next action | GPT, Claude, Llama on Groq |
| **Orchestrator** | Manages the order of operations, routing, and error handling | LangGraph |
| **Tools** | Connect the system to the outside world | Search APIs, databases, calendars, email |
| **Memory and state** | Stores the data needed during execution | A shared state object, or a database |
| **Supervisor** | Enforces rules and requests human approval for risky actions | An approval step before sending an email |

### Memory and State: Two Different Things

| Term | Meaning |
|---|---|
| **Workflow state** | Data needed to complete the current process |
| **Conversational memory** | Relevant information from earlier in a conversation |
| **Long-term memory** | Information stored across sessions, if the system is designed to keep it |

A LangGraph state object is not permanent memory by default. Persistence requires configuration and storage.

### How the Components Work Together

```text
User request / goal
        |
        v
LLM (interprets and decides)
        |
        v
Orchestrator (manages workflow state)
        |
        +--> Tools (APIs, databases, search)
        |
        v
Evaluate results (route, retry, or request approval)
        |
        v
Final result or next iteration
```

---

## 7. How Agentic Workflows Operate

The orchestrator controls the execution order and passes information between steps. Five common patterns are used.

| Pattern | How it works | Example |
|---|---|---|
| **Prompt chaining** | One LLM output becomes the input to the next step | Generate an outline, then write the article |
| **Routing** | Choose a path based on the request | Send technical questions to a specialized workflow |
| **Parallelization** | Run independent tasks at the same time | Analyze several documents together |
| **Orchestrator-worker** | A central component delegates tasks to workers | Assign research subtasks to different agents |
| **Evaluator-optimizer** | Generate, evaluate, and refine in a loop | Revise an article until it passes a quality check |

### Why State Matters

Suppose a system generates a blog article. It needs:

1. The topic.
2. An outline.
3. The article.
4. An evaluation score.

Each step depends on the previous one. Instead of passing values between unrelated functions, the workflow keeps them in one shared state:

```python
state = {
    "title": "Agentic AI Workflows",
    "outline": "",
    "content": "",
    "score": ""
}
```

Each step reads the fields it needs and updates the fields it produces. This idea is central to LangGraph.

---

## 8. Introduction to LangGraph

**LangGraph** is a framework for building stateful, multi-step LLM workflows. It models a workflow as a **graph**, where each step is a node and the connections between them are edges.

Instead of writing one large prompt, you define:

- The **steps** the workflow performs.
- The **data** shared between steps.
- The **order** in which steps run.

### Key Characteristics

| Characteristic | Meaning |
|---|---|
| **Graph-based** | Steps are nodes, and execution paths are edges |
| **Stateful** | A shared state carries data through the workflow |
| **Conditional** | The next step can depend on the current state |
| **Loops** | A step can be repeated until a condition is met |
| **Parallel** | Independent nodes can run in the same step |
| **Persistent** | Workflows can be saved and resumed when a checkpointer is configured |

### Core Concepts

| Concept | Role |
|---|---|
| **State** | The shared data structure passed through the workflow |
| **Node** | A function that reads the state and returns updates |
| **Edge** | Defines which node runs next |
| **START** | The entry point of the graph |
| **END** | The end of execution |
| **Reducer** | Defines how an update is combined with existing state |
| **Compile** | Validates the graph and prepares it for execution |
| **Invoke** | Runs the compiled workflow with an initial input |

### How Execution Works

LangGraph runs in steps called **supersteps**, inspired by Google's Pregel model. Nodes pass messages along edges to activate other nodes.

1. The graph receives its initial input.
2. The entry node runs.
3. Its state updates are applied.
4. The connected nodes are activated.
5. Execution continues until the graph reaches `END`.

---

## 9. Building Your First Stateful LLM Workflow

We will build a **blog-generation workflow** with three steps:

1. Generate an outline from a title.
2. Write a blog using that outline.
3. Evaluate the blog.

This workflow is sequential, so it is not fully autonomous. It is a foundation for building more agentic behavior.

### Step 1: Install the Libraries

```bash
pip install -U langgraph langchain-groq python-dotenv
```

| Library | Purpose |
|---|---|
| `langgraph` | Builds and runs the graph |
| `langchain-groq` | Connects to Groq's models |
| `python-dotenv` | Loads your API key from a `.env` file |

### Step 2: Get a Groq API Key

Groq is a good choice for learning because it offers API access with a free tier. Limits and available models can change, so check the Groq Console before relying on it for sustained use.

1. Create an API key in the Groq Console.
2. Create a `.env` file in your project folder:

```text
GROQ_API_KEY=your_groq_api_key_here
```

> **Important:** Never commit your `.env` file or paste your key into code you share publicly.

### Step 3: Import the Dependencies

```python
# Build the graph structure
from langgraph.graph import StateGraph, START, END

# Define the type of the shared state
from typing import TypedDict

# Load variables from the .env file
from dotenv import load_dotenv

# Connect to Groq's chat models
from langchain_groq import ChatGroq
```

### Step 4: Define the State

```python
# The shared data that every node can read and update
class BlogState(TypedDict):
    title: str      # Input: the blog topic
    outline: str    # Produced by the outline node
    content: str    # Produced by the blog node
    score: str      # Produced by the evaluation node
```

`TypedDict` describes the structure of the state for readability and type checking. It does not enforce the types at runtime.

### Step 5: Initialize the LLM

```python
# Read GROQ_API_KEY from the .env file
load_dotenv()

# Create the model client
model = ChatGroq(
    model="openai/gpt-oss-120b",  # Confirm this model is available in your account
    temperature=0                 # Lower values give more consistent outputs
)
```

`temperature=0` favors consistent output, but it does not guarantee identical responses.

### Step 6: Create the Outline Node

```python
def gen_outline(state: BlogState) -> dict:
    # Read the topic from the state
    title = state["title"]

    # Build the prompt
    prompt = f"Generate a detailed technical blog outline for the topic: {title}"

    # Call the model and get the text
    response = model.invoke(prompt).content

    # Return only the field this node updates
    return {"outline": response}
```

### Step 7: Create the Blog Node

```python
def gen_blog(state: BlogState) -> dict:
    # Read the topic and the outline from the previous step
    title = state["title"]
    outline = state["outline"]

    # Ask the model to follow the outline
    prompt = f"""
    Write a detailed technical blog on: {title}

    Follow this outline:
    {outline}

    Explain concepts clearly, use headings, and include code examples where relevant.
    """

    # Generate the blog and store it in the state
    response = model.invoke(prompt).content
    return {"content": response}
```

This node uses the output of the previous node. This is **prompt chaining**.

### Step 8: Create the Evaluation Node

```python
def gen_score(state: BlogState) -> dict:
    # Read the topic, outline, and blog from the state
    title = state["title"]
    outline = state["outline"]
    blog = state["content"]

    # Ask the model to rate the blog
    prompt = f"""
    Rate the blog from 1 to 10 for relevance, coverage of the outline,
    technical clarity, and structure. Give a short explanation.

    Topic: {title}
    Outline: {outline[:1500]}
    Blog: {blog[:4000]}
    """

    # Store the evaluation in the state
    response = model.invoke(prompt).content
    return {"score": response}
```

> **Note:** This score is generated by the LLM. It is a useful signal, not an objective measurement. The character limits keep the prompt short, but they may leave out parts of a long article.

### Step 9: Build and Compile the Graph

```python
# Create a graph that uses BlogState
graph = StateGraph(BlogState)

# Register the nodes
graph.add_node("make_outline", gen_outline)
graph.add_node("generate_blog", gen_blog)
graph.add_node("evaluate_blog", gen_score)

# Define the order of execution
graph.add_edge(START, "make_outline")
graph.add_edge("make_outline", "generate_blog")
graph.add_edge("generate_blog", "evaluate_blog")
graph.add_edge("evaluate_blog", END)

# Compile the graph into a runnable workflow
workflow = graph.compile()
```

The execution path is:

```text
START → make_outline → generate_blog → evaluate_blog → END
```

### Step 10: Run the Workflow

```python
# Provide only the initial input
initial_state = {
    "title": "Impact of Generative AI Workflows on Tech Jobs"
}

# Run the graph
final_state = workflow.invoke(initial_state)

# Print the results
print("OUTLINE:")
print(final_state["outline"])

print("\nBLOG:")
print(final_state["content"])

print("\nEVALUATION:")
print(final_state["score"])
```

The final state contains the topic, outline, blog, and evaluation.

### What Did We Build?

| Concept | Where it appears |
|---|---|
| **State management** | `BlogState` stores data shared across steps |
| **Nodes** | Three functions, each with one job |
| **Edges** | Define the execution order |
| **Prompt chaining** | The blog uses the outline |
| **Evaluation** | The last node reviews the result |

This workflow is still fixed. The evaluator does not decide to rewrite the blog, and the model does not choose its own tools. Those features come next.

---

## 10. From a Sequential Workflow to an Agentic System

To make this workflow more agentic, you can add:

| Capability | What it adds |
|---|---|
| **Conditional routing** | Rewrite the blog if the score is low |
| **Loops with a limit** | Retry revisions, with a maximum number of attempts to control cost |
| **Tool calling** | Let the model retrieve documentation or search sources |
| **Persistence** | Resume an interrupted workflow |
| **Human approval** | Review the blog before publishing |
| **Observability** | Track model calls, execution paths, and token usage |

Autonomy without validation can make a system less reliable. A well-designed agentic system makes decisions within clear limits and keeps its behavior visible to developers.

---

## Key Takeaways

| Idea | Summary |
|---|---|
| **Agentic workflow** | A process that coordinates model calls, tools, and results to reach a goal |
| **Generative AI vs. Agentic AI** | Generative AI creates content; Agentic AI pursues goals through actions |
| **Core components** | LLM, orchestrator, tools, memory/state, and supervisor |
| **LangGraph** | Models workflows as stateful graphs of nodes and edges |
| **First workflow** | Several LLM calls connected through shared state |

**The key engineering shift is from calling an LLM to designing, orchestrating, and observing the entire system around it.**
