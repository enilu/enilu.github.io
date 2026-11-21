---
source_sha256: 926ae269280afa88bdf2c207d969d04a4e96e35485c4bcc6cd5969342e0ecb54
title: "Why Can Guessing the Next Word Lead to Intelligence?"
date: 2026-11-21
lang: en
translation_key: why-next-token-prediction-works
permalink: /en/2026/11/21/why-next-token-prediction-works/
description: "From 4K video and a Poirot mystery to compression, grokking, internal representations in Othello, and language model inference."
tags: [AI, Large language models]
---

## 1. A counterintuitive fact

Today's language models can write code, solve math problems, and help you analyze a situation from a description. Ask an engineer what a model like GPT does during pretraining, though, and the answer sounds simple. Take a passage from the training text and ask the model to guess what comes next. Use what immediately follows the passage as the answer, adjust the weights based on the prediction, and repeat at another position.

The technical term for “word” here is *token*. It can be a character, a piece of a word, or punctuation. The model assigns probabilities to the candidates. The lower the probability it assigns to the correct token, the higher the loss for that prediction. Every position in the training text can supply a question and its answer without manual labeling. [GPT-3 paper](https://arxiv.org/abs/2005.14165)

Here's the puzzle. Each example asks for a single token. How does doing that over and over lead to abilities like writing code, reasoning through a problem, and keeping track of context?
<!--break-->

<img src="/assets/images/2026/why-next-token-prediction-works.webp" alt="A row of marked tiles leads to a blank square beside an Othello board" style="display:block;max-width:100%;height:auto;" />

*AI-generated illustration inspired by the board state behind a move sequence.*

## 2. Start with something familiar: video

Play a 4K video on your phone. At 3,840 × 2,160 pixels, three bytes per pixel, and 60 frames per second, the uncompressed picture would take about 1.5 GB per second. Over two hours, the picture alone would use close to 11 TB. Watching video on a phone takes far less data because there's so much to reuse from one frame to the next.

Suppose someone is talking in front of a bookshelf. Their mouth moves, and the shelf barely changes. With H.264 inter-frame prediction, the encoder can look for similar blocks in a reference picture and encode where to take them from, how to move them, and what's left over after the prediction. The more the encoder can reuse, the less information there usually is to encode in the residual. [ITU-T H.264 specification, section 0.6](https://www.itu.int/rec/dologin_pub.asp?id=T-REC-H.264-202408-I%21%21PDF-E&lang=f&type=items)

Finding the right blocks lets the encoder exploit regularities in motion to save data. With language we can ask the same question. Which patterns help us make a better prediction?

## 3. Why prediction and compression are related

Imagine you're reading an Agatha Christie novel. On the last page, Poirot points into the crowd and says, “The murderer is—”

If you go by whose name comes up most, you might guess the detective himself. To fill in the name, you may have to go back and check who had a motive, who was free at the time of the murder, and whose alibi contradicts something from an earlier chapter. There's room for one name in the blank, with clues spread throughout the book. If you've memorized the novel, remembering the ending works too.

The link between prediction and compression has a precise mathematical meaning. Suppose the encoder and decoder have the same model. They can use the text so far to compute the same probabilities and feed them into an arithmetic coder. If the token that appears has probability `p`, its ideal code length is `−log₂(p)` bits. Raising the probability from 10% to 80% reduces the cost from about 3.32 bits to 0.32 bits. This is the cost of sending the text when both sides already have the model. [Delétang et al. on language modeling and compression](https://arxiv.org/abs/2309.10668)

That's why long-range clues are worth learning. A way of making sense of timelines and relationships can carry over to other stories. If all we see is one correct answer, remembering an ending and working it out can look exactly the same.

## 4. How far can memorization take you?

Models do memorize. Researchers have recovered verbatim passages of training text from GPT-2's output. The question is how well the same approach works on a problem it never saw during training. [Study of training-data memorization](https://arxiv.org/abs/2012.07805)

Take pi. To store its first 100,000 decimal digits, you could write down each digit, or you could store a program that computes them. A lookup is quick. A program can keep going and compute the 100,001st digit, at the cost of running it. That's the difference between storing each individual example and using one rule to describe many of them.

A similar trade-off can emerge during training. Weight decay nudges weights toward zero during updates. In some small experiments, a solution that generalizes can achieve roughly the same training loss with smaller weight norms, which favors it under these settings. How much this matters depends on the task, the data, and the training setup. Modular addition gives us a case we can examine closely. [Nanda et al.'s analysis of weight decay](https://arxiv.org/html/2301.05217v3)

## 5. Why does emergence look so sudden?

### The score jumps after a long period of internal change

Power and colleagues experimented with small algorithmic tasks. The models learned to answer the training questions early, while test performance barely improved. Much later in training, the models suddenly began getting unseen questions right. This phenomenon is called *grokking*. [Original grokking paper](https://arxiv.org/abs/2201.02177)

Nanda and colleagues investigated addition modulo 113. Modular addition is like reading a clock. Three hours after 11, the hand wraps around to 2. Here, the circle has 113 positions. They found that a small Transformer represented the inputs using sines and cosines at several frequencies, then used trigonometric identities to add the corresponding angles. Signals from several frequencies combined to push the correct remainder to the top. The examples supplied two numbers and their answer. The model learned the Fourier computation during training. [Mechanistic analysis of modular addition](https://arxiv.org/html/2301.05217v3)

The researchers tracked those frequencies through training and found that the computation that generalized was already taking shape while test scores were flat. Later, the components that had memorized training examples weakened, and the test loss dropped sharply. It's like repairing a radio. You hear sound at a particular moment, after you've already soldered a lot of parts in place.

### The scoring rule can make the curve steeper

Sometimes the scoring rule amplifies a change. Suppose a question has 10 blanks, each with the same independent probability `p` of being right. If a single wrong answer earns zero for the whole question, the probability of getting credit is `p^10`.

| Chance of getting one blank right | Chance of getting all 10 right |
| --- | --- |
| 50% | About 0.10% |
| 70% | About 2.82% |
| 90% | About 34.87% |

Performance on each blank improves smoothly. Multiply the ten probabilities and the curve gets steep. This table is illustrative. In real tasks, errors can affect one another. Schaeffer and colleagues found that some abilities that seemed to appear suddenly improved more smoothly under a more continuous scoring rule. When a benchmark takes off, it's worth asking how the score was calculated. [Schaeffer et al.'s study of evaluation metrics](https://arxiv.org/abs/2304.15004)

## 6. How does it learn the board from moves alone?

Othello is played on an 8 × 8 board. Each move can flip disks caught between the player's pieces. The game record lists the squares where the disks were placed. To determine the legal moves, you need to know which squares are black, white, or empty now.

The Othello-GPT team set up a clean experiment. They trained an eight-layer GPT on 20 million synthetic games. The model received only move positions, without a board diagram or an explanation of the rules. On unseen games, the synthetic-data model's top prediction was legal 99.99% of the time. This measures legality. There can be several legal moves on the same turn. [Othello-GPT paper, section 2](https://arxiv.org/html/2210.13382v5)

The researchers then took activation vectors from inside the model and used a small nonlinear probe to recover the board. They could read it out, but that left the question of whether the model used it to make predictions. So they kept the move sequence fixed and changed the activations until the probe read out a modified board. The model's next-move probabilities shifted toward legal moves on that new board. [Othello-GPT probing and intervention experiments](https://arxiv.org/html/2210.13382v5)

I find that more interesting than the number of moves it gets right. Behind the move sequence is a board that's changing. To predict the sequence, the model learned an internal representation corresponding to that board. Researchers can change the representation and see whether the moves change with it.

## 7. From Othello to natural language

Suppose a story says Zhang drops a glass from a second-floor balcony and hears a sharp crack below. You would probably continue with “it broke.” Now add that someone caught the glass in a net, and the noise came from a nearby glass door. To continue the story sensibly, you have to keep track of what happened to the glass and what made the sound. Getting the first version right tells us little about which details the model used.

The states involved in language are much more complicated than a board position. What a character is thinking, where a glass ended up, and which event caused which outcome often take context to establish. One thing interpretability research can do is identify features that recur inside the model, then examine when they appear and what happens if they are changed.

One idea is *superposition*. A single activation vector can represent several features, and those features can share the same neurons. If only a few features are active at any given time, the model can potentially represent more directions in the same space. A sparse autoencoder, or SAE, tries to reconstruct the original activation with a small number of active features, teasing out directions from the mixed signal. [Anthropic's superposition experiments](https://transformer-circuits.pub/2022/toy_model/index.html) · [SAE study of Claude 3 Sonnet](https://transformer-circuits.pub/2024/scaling-monosemanticity/index.html)

The Golden Gate Bridge is a fun example. Researchers found a feature in Claude 3 Sonnet that responds strongly to references to the bridge. Turning up its activation made the model more likely to bring it up even in answers to other questions. Some features also respond more weakly to related subjects, so finding an interpretable direction gives us a look at one part of the system. [Golden Gate Bridge feature intervention](https://transformer-circuits.pub/2024/scaling-monosemanticity/index.html)

## 8. How does the model pick up a pattern from a few examples?

Give a language model a few examples of inputs and outputs in the prompt, and it can sometimes apply the same format to a new input. Its weights stay fixed. What changes is what it sees in this exchange and the activations each layer computes from it. This is called *in-context learning*. [GPT-3 few-shot experiments](https://arxiv.org/abs/2005.14165)

In small models, researchers found a mechanism called an *induction head*. Suppose the context contained `A B` and then another `A`. Two attention heads can work together. The first brings information about the preceding token to each position. The second can find the earlier `B` that followed `A` and make `B` more likely this time. This mechanism helps explain how a model continues patterns that recur in context. [Olsson et al. on induction heads](https://transformer-circuits.pub/2022/in-context-learning-and-induction-heads/index.html)

Other researchers approached the question from a different angle. In a deliberately constructed linear self-attention layer and regression task, the transformation done by one attention layer can be equivalent to a step of gradient descent on the regression loss. This is a concrete mathematical example of how predictions can adapt to the examples in a prompt while the model's weights stay fixed. Understanding which mechanisms a production model uses takes further analysis. [Von Oswald et al.'s linear regression experiments](https://arxiv.org/abs/2212.07677)

## 9. When one step isn't enough, take more

The same Transformer passes through a fixed number of layers each time it generates a token. The amount of work per step also depends on the length of the context. On a math problem that calls for checking boundary conditions and then testing a way to eliminate a variable, jumping straight to the answer leaves little computation for those intermediate steps.

A chain of thought gives the model room to write “suppose x is greater than zero,” then check whether a denominator can still become zero. Tokens it has written go into context, where later generation can use them. Think of this as scratch paper. Once a result is written down, later steps can go back and check it. Real models have finite contexts. A KV cache stores the keys and values used in attention to avoid recomputing them. [Chain-of-thought prompting](https://arxiv.org/abs/2201.11903) · [KV cache documentation](https://huggingface.co/docs/transformers/main/cache_explanation)

Another way to spend compute at inference time is to generate several candidate solutions and score them with a verifier. Training offers a separate option. Where answers can be checked, reinforcement learning can use correctness as a reward to make successful solution sequences more likely. One approach spends extra compute while answering. The other updates weights during training. How much the extra inference work helps depends on the problem and the method used to verify answers. [Study of inference-time compute](https://arxiv.org/abs/2408.03314) · [DeepSeek-R1 paper](https://arxiv.org/abs/2501.12948)

## 10. The goal is simple

If we were writing rules for these tasks by hand, we'd have to spell out how to flip disks, who a pronoun refers to, and which line in a detective novel counts as testimony. Prediction specifies how to score an answer and allows the model to learn many of the intermediate steps during training. The training text supplies the answers. The same objective can cover everything from familiar phrases to reasoning across a passage.

## Epilogue: The analogy of the eye

I like to think about this through the example of eyes and natural selection. An animal that can sense light may have an easier time finding food or avoiding danger. Natural selection contains no instruction to develop an eye. In some environments, being able to see helps, and structures that sense light can be favored over time.

Next-token prediction can be thought of as a kind of selection pressure. The training objective contains no instruction to track a board, but the board state helps the model guess a legal next move. All we see on screen is one disk placed on a square. The board is what the model learned along the way to placing it.

## References

1. [Zhihu answer](https://www.zhihu.com/question/1968361285579150015/answer/2106858330085914300)
2. [Language Models are Few-Shot Learners](https://arxiv.org/abs/2005.14165)
3. [Language Modeling Is Compression](https://arxiv.org/abs/2309.10668)
4. [Progress Measures for Grokking via Mechanistic Interpretability](https://arxiv.org/html/2301.05217v3)
5. [Are Emergent Abilities of Large Language Models a Mirage?](https://arxiv.org/abs/2304.15004)
6. [Emergent World Representations: Exploring a Sequence Model Trained on a Synthetic Task](https://arxiv.org/html/2210.13382v5)
7. [Scaling Monosemanticity: Extracting Interpretable Features from Claude 3 Sonnet](https://transformer-circuits.pub/2024/scaling-monosemanticity/index.html)
8. [In-context Learning and Induction Heads](https://transformer-circuits.pub/2022/in-context-learning-and-induction-heads/index.html)
9. [Scaling LLM Test-Time Compute Optimally Can Be More Effective than Scaling Model Parameters](https://arxiv.org/abs/2408.03314)
