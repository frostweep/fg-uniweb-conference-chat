using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using FrostweepGames.UniWebConferencePro;

namespace FrostweepGames.UniWebConferencePro.Examples
{
    public class Example : MonoBehaviour
    {
        private List<VideoItem> _videoItems;

        private List<MessageItem> _messageItems;

        public InputField textInput;

        public InputField nameInput;

        public Transform parentOfMessages;

        public Transform parentOfVideos;

        public GameObject textMessagePrefab;

        public GameObject videoPrefab;

        public Button connectButton,
                      leaveChannelButton,
                      sendMessageButton;

        public Toggle setMuteaudioButton,
                      setMutevideoButton;

        public Text connectedUsersText,
                    statusText;

        private void Awake()
        {
            _videoItems = new List<VideoItem>();
            _messageItems = new List<MessageItem>();

            UniWebConference.Instance.TextMessageReceivedEvent += TextMessageReceivedEventHandler;
            UniWebConference.Instance.UserConnectedEvent += UserConnectedEventHandler;
            UniWebConference.Instance.UserDisconnectedEvent += UserDisconnectedEventHandler;
            UniWebConference.Instance.ChannelJoinedEvent += ChannelJoinedEventHandler;
            UniWebConference.Instance.ChannelJoinFailedEvent += ChannelJoinFailedEventHandler;
            UniWebConference.Instance.ChannelLeftEvent += ChannelLeftEventHandler;
            UniWebConference.Instance.ConnectFailedEvent += ConnectFailedEventHandler;
            UniWebConference.Instance.ConnectedEvent += ConnectedEventHandler;
            UniWebConference.Instance.DisconnectedEvent += DisconnectedEventEventHandler;
            UniWebConference.Instance.StreamBeganEvent += StreamBeganEventHandler;
            UniWebConference.Instance.StreamFailedEvent += StreamFailedEventHandler;

            nameInput.text = $"Guest_{UnityEngine.Random.Range(0, 9999999)}";

            connectButton.interactable = true;
            leaveChannelButton.interactable = false;
            setMuteaudioButton.interactable = false;
            setMutevideoButton.interactable = false;
            sendMessageButton.interactable = false;
        }

        private void OnDestroy()
        {
            UniWebConference.Instance.TextMessageReceivedEvent -= TextMessageReceivedEventHandler;
            UniWebConference.Instance.UserConnectedEvent -= UserConnectedEventHandler;
            UniWebConference.Instance.UserDisconnectedEvent -= UserDisconnectedEventHandler;
            UniWebConference.Instance.ChannelJoinedEvent -= ChannelJoinedEventHandler;
            UniWebConference.Instance.ChannelJoinFailedEvent -= ChannelJoinFailedEventHandler;
            UniWebConference.Instance.ChannelLeftEvent -= ChannelLeftEventHandler;
            UniWebConference.Instance.ConnectFailedEvent -= ConnectFailedEventHandler;
            UniWebConference.Instance.ConnectedEvent -= ConnectedEventHandler;
            UniWebConference.Instance.DisconnectedEvent -= DisconnectedEventEventHandler;
            UniWebConference.Instance.StreamBeganEvent -= StreamBeganEventHandler;
            UniWebConference.Instance.StreamFailedEvent -= StreamFailedEventHandler;
        }

        private void Update()
        {
            statusText.text = $"Status: {UniWebConference.Instance.State}";
            connectedUsersText.text = $"Users: {UniWebConference.Instance.JoinedUsers.Count}";
        }

        private void ChannelLeftEventHandler()
        {
            Debug.Log("ChannelLeftEventHandler");

            foreach (var item in _messageItems)
                item.Dispose();
            _messageItems.Clear();

            connectButton.interactable = true;
            leaveChannelButton.interactable = false;
            setMuteaudioButton.interactable = false;
            setMutevideoButton.interactable = false;
            sendMessageButton.interactable = false;
            setMuteaudioButton.isOn = false;
            setMutevideoButton.isOn = false;
        }

        private void ConnectedEventHandler()
        {
            Debug.Log("ConnectedEventHandler");
        }

        private void DisconnectedEventEventHandler()
        {
            Debug.Log("DisconnectedEventEventHandler");

            connectButton.interactable = true;
            leaveChannelButton.interactable = false;
            setMuteaudioButton.interactable = false;
            setMutevideoButton.interactable = false;
            sendMessageButton.interactable = false;
            setMuteaudioButton.isOn = false;
            setMutevideoButton.isOn = false;
        }

        private void ChannelJoinedEventHandler()
        {
            Debug.Log("ChannelJoinedEventHandler");

            connectButton.interactable = false;
            leaveChannelButton.interactable = true;
            setMuteaudioButton.interactable = true;
            setMutevideoButton.interactable = true;
            sendMessageButton.interactable = true;
        }

        private void StreamBeganEventHandler()
        {
            Debug.Log("StreamBeganEventHandler");

            UniWebConference.Instance.JoinChannel();
        }

        private void StreamFailedEventHandler(string error)
        {
            Debug.Log(error);

            connectButton.interactable = true;
        }

        private void ConnectFailedEventHandler(string error)
        {
            Debug.Log(error);

            connectButton.interactable = true;
            leaveChannelButton.interactable = false;
            setMuteaudioButton.interactable = false;
            setMutevideoButton.interactable = false;
            sendMessageButton.interactable = false;
            setMuteaudioButton.isOn = false;
            setMutevideoButton.isOn = false;
        }

        private void ChannelJoinFailedEventHandler(string error)
        {
            Debug.Log(error);

            connectButton.interactable = true;
            leaveChannelButton.interactable = false;
            setMuteaudioButton.interactable = false;
            setMutevideoButton.interactable = false;
            sendMessageButton.interactable = false;
            setMuteaudioButton.isOn = false;
            setMutevideoButton.isOn = false;
        }

        private void UserConnectedEventHandler(UniWebConference.User user)
        {
            _videoItems.Add(new VideoItem(videoPrefab, parentOfVideos, user));
        }

        private void UserDisconnectedEventHandler(UniWebConference.User user)
        {
            var item = _videoItems.Find(it => it.User == user);
            if (item != null)
            {
                item.Dispose();
                _videoItems.Remove(item);
            }
        }

        private void TextMessageReceivedEventHandler(UniWebConference.TextMessage textMessage)
        {
            _messageItems.Add(new MessageItem(textMessagePrefab, parentOfMessages, textMessage));
        }

        public void SetMuteAudio(bool isOn)
        {
            UniWebConference.Instance.SetMuteStatusAudio(isOn);
        }

        public void SetMuteVideo(bool isOn)
        {
            UniWebConference.Instance.SetMuteStatusVideo(isOn);
        }

        public void LeaveChannel()
        {
            UniWebConference.Instance.LeaveChannel();
        }

        public void Init()
        {
            if (string.IsNullOrEmpty(nameInput.text) || string.IsNullOrWhiteSpace(nameInput.text))
                nameInput.text = $"Guest_{UnityEngine.Random.Range(0, 9999999)}";

            if (UniWebConference.Instance.State == UniWebConference.ConnectionState.Connected)
            {
                UniWebConference.Instance.SetUser(new UniWebConference.UserInfo()
                {
                    name = nameInput.text
                });

                UniWebConference.Instance.BeginMediaStream(true, true);

                connectButton.interactable = false;
            }
            else
            {
                // Try to connect if disconnected
                UniWebConference.Instance.Connect();
            }
        }

        public void SendMessage()
        {
            string text = textInput.text;

            if (!string.IsNullOrEmpty(text) && !string.IsNullOrWhiteSpace(text))
            {
                UniWebConference.Instance.SendMessage(text);

                textInput.text = string.Empty;
            }
        }

        public class MessageItem
        {
            private GameObject _selfObject;

            private Text _messageText;

            public MessageItem(GameObject prefab, Transform parent, UniWebConference.TextMessage message)
            {
                _selfObject = MonoBehaviour.Instantiate(prefab, parent, false);

                _messageText = _selfObject.transform.Find("Text_Value").GetComponent<Text>();

                _messageText.text = $"<b>{message.user.name}:</b> {message.message}";
            }

            public void Dispose()
            {
                MonoBehaviour.Destroy(_selfObject);
            }
        }

        public class VideoItem
        {
            private GameObject _selfObject;

            private Text _nameText;

            private RawImage _videoRawImage;

            public UniWebConference.User User { get; }

            public VideoItem(GameObject prefab, Transform parent, UniWebConference.User user)
            {
                User = user;

                _selfObject = MonoBehaviour.Instantiate(prefab, parent, false);

                _nameText = _selfObject.transform.Find("Text_Value").GetComponent<Text>();
                _videoRawImage = _selfObject.transform.Find("Image_View").GetComponent<RawImage>();

                _nameText.text = User.UserInfo.name;

                User.VideoFrame.FrameInitializedEvent += FrameInitializedEventHandler;
            }

            public void Dispose()
            {
                MonoBehaviour.Destroy(_selfObject);
            }

            private void FrameInitializedEventHandler()
            {
                _videoRawImage.texture = User.VideoFrame.Texture;
            }
        }
    }
}