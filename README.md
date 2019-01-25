# VideoInTheaterMode

Let video in browser to fit the full viewport

# Change log

> 1.1.0
- Added fool-proofing mechanism: you can't turn on theater mode in full screen.
- Added new feature: when you turn on theater mode and then click the fullscreen button, the video ratio will be 21:9(support few webpage).

| Step | Detail |
|--|--|
| 1 | Turn on the theater mode. |
| 2 | Click the fullscreen button if exist. |
| 3 | It will change video to 21:9 in fullscreen(Just support few webpage, EX: Youtube). |


> 1.0.4
- Fixed that the theater mode will fail when parent of video contains another videos.
- Fixed that in multiple videos webpage, when turn the theater mode on and select video, the selected hint will show in weird position.
- Fixed that the video use "%" to set height & width style will scale fail when turn the theater mode on.
- Fixed videos in some webpages are set the "top" & "left" value, and this would cause the video in weird position.

> 1.0.3
- Let some videos in theater mode could pause/play when click the video, for example: Youtube.

> 1.0.2
- Fixed some videos size in theater mode could be cut.

> 1.0.1
- Rename variables.
- Improve performance.

> 1.0.0
- This version is stable enough.
- Correct the mechanism when detect multiple videos.

| Step | Detail |
|--|--|
| 1 | Turn on the theater mode and then browser will show message if detect many videos in the webpage. |
| 2 | According to message, click one video which you want to turn it in theater mode. |
| 3 | It will turn on the theater mode automatically. |

- Ensure video could fill browser with its controlbar.
- Fixed bugs.

- Existing bug: (1)couldn't pause the video when click it, now you need to directly click button on controlbar or just use keyboard to control everything you have used before.

> 0.9.0
- Add new mechanism (3 steps): 

| Step | Detail |
|--|--|
| 1 | Turn on the theater mode and then browser will show message if detect many videos in the webpage. |
| 2 | According to message, click one video which you want to turn it in theater mode. |
| 3 | Turn on the theater mode again, it may be successful. |

- Fixed bugs.

> 0.8.0
- Support video with HTML iframe tag.
- Fixed bugs.

> 0.7.0

- Compatible with most websites.
- Fixed bugs.

> 0.1.0

- First release.
