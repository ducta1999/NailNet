import React, { Component } from "react";
import { StyleSheet, TouchableOpacity, Image, ScrollView } from "react-native";
import {
    Container,
    Content,
    Form,
    Item,
    Input,
    Thumbnail,
    Button,
    View,
    Text,
    Card,
    CardItem,
    Body,
    Header,
    Label,
    Spinner,
    Textarea
} from "native-base";
// import ImagePicker from "react-native-image-picker";
import ImagePicker from "react-native-image-crop-picker";
import * as dataService from "../../services/DataService";
import * as formatDate from "../../services/FormatDate";
import * as toastService from "../../services/ToastService";
import * as authentication from "../../services/Authentication";
import DateTimePicker from "react-native-modal-datetime-picker";
import Icon from "react-native-vector-icons/FontAwesome";
import SectionedMultiSelect from "react-native-sectioned-multi-select";

export default class AddJob extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            title: "",
            phone: "",
            email: "",
            address: "",
            price: 0,
            description: "",
            rawFromDate: null,
            rawToDate: null,
            fromDate: "",
            toDate: "",          
            isFromDateTimePickerVisible: false,
            isToDateTimePickerVisible: false,
            selectedCategory: [],
            categories: [],
            buttonLoading: false,
            options: {
                title: "Select Avatar",
                //customButtons: [{ name: "fb", title: "Choose Photo from Facebook" }],
                storageOptions: {
                    skipBackup: true,
                    path: "images"
                }
            },
            avatarSource: []
        };
    }

    async componentDidMount() {
        // var cities = await dataService.getOnlineData(
        //   "https://thongtindoanhnghiep.co/api/city"
        // );
     

        var categories = await dataService.get("api/jobcategories/getall");
        var itemCategories = [{ name: "Category", id: 0, children: [] }];

        for (var j = categories.items.length - 1; j >= 0; j--) {
            itemCategories[0].children.push({
                name: categories.items[j].description,
                id: categories.items[j].id
            });
        }

        this.setState({
            loading: false,
           
            categories: itemCategories
            //  selectedCategory: faqindustries.items[0].id
        });
    }

    showFromDateTimePicker = () => {
        this.setState({ isFromDateTimePickerVisible: true });
    };

    hideFromDateTimePicker = () => {
        this.setState({ isFromDateTimePickerVisible: false });
    };

    handleFromDatePicked = date => {
        this.setState({ fromDate: formatDate.formatDate(date), rawFromDate: date });
        this.hideFromDateTimePicker();
    };

    showToDateTimePicker = () => {
        this.setState({ isToDateTimePickerVisible: true });
    };

    hideToDateTimePicker = () => {
        this.setState({ isToDateTimePickerVisible: false });
    };

    handleToDatePicked = date => {
        this.setState({ toDate: formatDate.formatDate(date), rawToDate: date });
        this.hideToDateTimePicker();
    };

    async submit() {
        var user = await authentication.getLoggedInUser();
        this.setState({ buttonLoading: true });

        const {
            title,
            phone,
            email,
            selectedCategory,
            price,
            address,
            description,
            rawFromDate,
            rawToDate,
      
            avatarSource
        } = this.state;

        if (
            title.trim() == "" ||
            phone.trim() == "" ||
            email.trim() == "" ||
            address.trim()==""||
            selectedCategory.length == 0 ||

            description.trim() == "" ||
            rawFromDate == null ||
            rawToDate == null
        ) {
            toastService.error("Error: "+"Input cannot be empty!");
        } else if (!formatDate.checkIsBefore(rawFromDate, rawToDate)) {
            toastService.error("Error: "+
                "From Date and To Date is not valid. Please check again"
            );
        } else {
            var data = {
                title: title,
                phone: phone,
                email: email,
                price: price,
                description: description,
                fromDate: formatDate.formatDateToSendAPI(rawFromDate),
                toDate: formatDate.formatDateToSendAPI(rawToDate),
                address: address,
                categoryID: selectedCategory[0],
                createByEmail: user.email
            };

            var result = await dataService.post("api/jobs/add", data);

            if (result.status === 200) {
                toastService.success("Add job successfully!");

                for (var i = 0; i < avatarSource.length; i++) {
                    var image = avatarSource[i];
                    var data = {
                        jobID: result.data.id,
                        createByEmail: user.email
                    };
                    var jobImage = await dataService.post(
                        "api/jobimages/add",
                        data
                    );

                    dataService.post(
                        "api/jobimages/upload/" + jobImage.data.id,
                        {
                            extension: "." + image.extension,
                            base64: image.base64
                        }
                    );
                }

                this.props.navigation.goBack();
            } else {
                toastService.error("Error: "+result.data);
            }
        }
        this.setState({ buttonLoading: false });
    }

    async showImagePicker(options) {
        if (this.state.avatarSource && this.state.avatarSource.length >= 5) {
            toastService.error("Error: "+"You only can add 5 image");
            return;
        }
        ImagePicker.openPicker({
            multiple: true,
            includeBase64: true
        }).then(images => {
            if (images.length > 5) {
                toastService.error("Error: "+"You only can add 5 image");
                images = images.slice(0, 5);
                //  console.log(images);
            }

            var imageSources = [];
            for (var i = 0; i < images.length; i++) {
                var image = {
                    source: images[i].path,
                    base64: images[i].data,
                    mime: images[i].mime,
                    extension:
                        images[i].mime == null ? "png" : images[i].mime.split("/")[1]
                };
                imageSources.push(image);
            }

            this.setState({
                avatarSource: imageSources
            });
        });
        // ImagePicker.showImagePicker(options, response => {
        //   console.log(response);
        //   if (response.didCancel) {
        //     console.log("User cancelled image picker");
        //   } else if (response.error) {
        //     console.log("ImagePicker Error: ", response.error);
        //   } else if (response.customButton) {
        //     console.log("User tapped custom button: ", response.customButton);
        //   } else {
        //     const source = { uri: response.uri };
        //     const data = response.data;
        //     const type = response.type;

        //     var image = {
        //       source: source,
        //       base64: data,
        //       extension: type == null ? "png" : type.split("/")[1]
        //     };
        //     // console.log({
        //     //   extension: "." + image.extension,
        //     //   base64: image.base64
        //     // });

        //     // dataService.post("api/promotionpictures/upload/1", {
        //     //   extension: "." + image.extension,
        //     //   base64: image.base64
        //     // });

        //     this.setState({
        //       avatarSource: this.state.avatarSource.concat([image])
        //     });
        //   }
        // });
    }

    render() {
        const {
            title,
            phone,
            email,
            address,
            price,
            description,
            fromDate,
            toDate,
           
            loading,
            isFromDateTimePickerVisible,
            isToDateTimePickerVisible,
            options,
            avatarSource
        } = this.state;

        return (
            <Container style={styles.container}>
                <Header hasTabs transparent>
                    <View
                        style={{
                            flex: 1,
                            flexDirection: "row",
                            justifyContent: "space-between",
                            marginTop: 8
                        }}
                    >
                        <View>
                            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                                <Thumbnail
                                    small
                                    source={require("../../icons/left_arrow.png")}
                                    style={styles.thumbnail}
                                />
                            </TouchableOpacity>
                        </View>
                        <View>
                            <View>
                                <Text style={styles.title}>ADD PROMOTION</Text>
                            </View>
                        </View>
                        <View />
                    </View>
                </Header>

                <Content>
                    {loading == false ? (
                        <Card transparent>
                            <CardItem style={styles.carditem}>
                                <Content>
                                    <Form>
                                        <View style={styles.item}>
                                            <Button
                                                block
                                                backgroundColor="#D94526"
                                                onPress={() => this.showImagePicker(options)}
                                            >
                                                <Text>Add image</Text>
                                            </Button>

                                            {avatarSource && (
                                                <ScrollView
                                                    horizontal={true}
                                                    style={{
                                                        flex: 1,
                                                        flexDirection: "row",
                                                        marginTop: 10
                                                    }}
                                                >
                                                    {avatarSource.map((item, i) => (
                                                        <Image
                                                            //source={item.source}
                                                            source={{
                                                                uri: `data:${item.mime};base64,${item.base64}`
                                                            }}
                                                            style={{
                                                                width: 100,
                                                                height: 100,
                                                                resizeMode: "contain"
                                                            }}
                                                        />
                                                    ))}
                                                </ScrollView>
                                            )}
                                        </View>

                                        <Item style={styles.item}>
                                            <Label style={styles.label}>Title</Label>
                                            <Input
                                                placeholder="Please enter your title..."
                                                placeholderTextColor="#848484"
                                                onChangeText={text => this.setState({ title: text })}
                                                value={title}
                                                style={styles.input}
                                            />
                                        </Item>

                                        <Item style={styles.item}>
                                            <Label style={styles.label}>Email</Label>
                                            <Input
                                                placeholder="Please enter your email..."
                                                placeholderTextColor="#848484"
                                                onChangeText={text => this.setState({ email: text })}
                                                value={email}
                                                style={styles.input}
                                            />
                                        </Item>

                                        <Item style={styles.item}>
                                            <Label style={styles.label}>Phone</Label>
                                            <Input
                                                placeholder="Please enter your phone..."
                                                placeholderTextColor="#848484"
                                                onChangeText={text => this.setState({ phone: text })}
                                                value={phone}
                                                style={styles.input}
                                            />
                                        </Item>


                                        <Item style={styles.item}>
                                            <Label style={styles.label}>Address</Label>
                                            <Input
                                                placeholder="Please enter your address..."
                                                placeholderTextColor="#848484"
                                                onChangeText={text => this.setState({ address: text })}
                                                value={address}
                                                style={styles.input}
                                            />
                                        </Item>

                                        <View
                                            style={{
                                                marginLeft: 14,
                                                marginTop: 10
                                            }}
                                        >
                                            <View>
                                                <Label style={styles.label}>Category</Label>
                                            </View>
                                            <View
                                                style={{
                                                    marginLeft: 60,
                                                    justifyContent: "center",
                                                    marginTop: -43
                                                }}
                                            >
                                                {this.state.loading == false && (
                                                    <SectionedMultiSelect
                                                        items={this.state.categories}
                                                        uniqueKey="id"
                                                        subKey="children"
                                                        expandDropDowns={true}
                                                        selectText="Choose category..."
                                                        showDropDowns={true}
                                                        readOnlyHeadings={true}
                                                        onSelectedItemsChange={value =>
                                                            this.setState({ selectedCategory: value })
                                                        }
                                                        selectedItems={this.state.selectedCategory}
                                                        single={true}
                                                        selectToggleIconComponent={
                                                            <Icon
                                                                name="caret-down"
                                                                color="#D94526"
                                                                size={30}
                                                                style={styles.caretIcon}
                                                            />
                                                        }
                                                        searchIconComponent={
                                                            <Icon
                                                                name="search"
                                                                color="#D94526"
                                                                size={15}
                                                                style={{ marginLeft: 15 }}
                                                            />
                                                        }
                                                        colors={color}
                                                        styles={multiSelectStyles}
                                                    />
                                                )}
                                            </View>
                                        </View>

                                        {/* <Item style={styles.item}>
                      <Label style={styles.label}>category</Label>
                      {this.state.loading == false &&
                        this.state.faqindustries &&
                        this.state.faqindustries.items && (
                          <Picker
                            mode="dropdown"
                            placeholder="Choose category"
                            iosIcon={<Icon name="arrow-down" />}
                            style={styles.picker}
                            selectedValue={this.state.selectedCategory}
                            onValueChange={value =>
                              this.setState({ selectedCategory: value })
                            }
                          >
                            {this.state.faqindustries.items.map(
                              (category, i) => (
                                <Picker.Item
                                  label={category.description}
                                  value={category.id}
                                  key={i}
                                />
                              )
                            )}
                          </Picker>
                        )}
                    </Item> */}

                                        <Item style={styles.item}>
                                            <Label style={styles.label}>From Date</Label>
                                            <TouchableOpacity onPress={this.showFromDateTimePicker}>
                                                <Input
                                                    disabled={true}
                                                    placeholder="Please choose your from date..."
                                                    placeholderTextColor="#848484"
                                                    //onChangeText={text => this.setState({ phone: text })}
                                                    value={fromDate}
                                                    style={styles.input}
                                                />
                                            </TouchableOpacity>

                                            <DateTimePicker
                                                isVisible={this.state.isFromDateTimePickerVisible}
                                                onConfirm={this.handleFromDatePicked}
                                                onCancel={this.hideFromDateTimePicker}
                                            />
                                        </Item>

                                        <Item style={styles.item}>
                                            <Label style={styles.label}>To Date</Label>
                                            <TouchableOpacity onPress={this.showToDateTimePicker}>
                                                <Input
                                                    disabled={true}
                                                    placeholder="Please choose your to date..."
                                                    placeholderTextColor="#848484"
                                                    //onChangeText={text => this.setState({ phone: text })}
                                                    value={toDate}
                                                    style={styles.input}
                                                />
                                            </TouchableOpacity>

                                            <DateTimePicker
                                                isVisible={this.state.isToDateTimePickerVisible}
                                                onConfirm={this.handleToDatePicked}
                                                onCancel={this.hideToDateTimePicker}
                                            />
                                        </Item>

                                        <Item style={styles.item}>
                                            <Label style={styles.label}>Price ($/h)</Label>
                                            <Input
                                                placeholder="Please enter your price..."
                                                placeholderTextColor="#848484"
                                                keyboardType="numeric"
                                                onChangeText={
                                                    text => this.setState({ price: parseFloat(text) })
                                                    // this.setState({
                                                    //   discount:
                                                    //     text.replace(/\D*/, "") == ""
                                                    //       ? ""
                                                    //       : parseInt(text.replace(/\D*/, ""))
                                                    // })
                                                }
                                                value={price}
                                                style={styles.input}
                                            />
                                        </Item>

                                       
                                        <Item style={styles.item} stackedLabel>
                                            <Label style={styles.label}>Description</Label>
                                            <Textarea
                                                placeholder="Please enter your description..."
                                                placeholderTextColor="#848484"
                                                rowSpan={5}
                                                //bordered
                                                onChangeText={text =>
                                                    this.setState({ description: text })
                                                }
                                                value={description}
                                                style={styles.textArea}
                                            />
                                        </Item>
                                    </Form>
                                </Content>
                            </CardItem>

                            <CardItem footer style={styles.buttonGroup}>
                                <View style={styles.cardFooter}>
                                    <TouchableOpacity
                                        onPress={() => this.props.navigation.goBack()}
                                        style={styles.cancel}
                                    >
                                        <Text style={styles.cancelText}>CANCEL</Text>
                                    </TouchableOpacity>

                                    <Button
                                        backgroundColor="#47BFB3"
                                        style={styles.submitButton}
                                        onPress={() => this.submit()}
                                    >
                                        {this.state.buttonLoading == true && (
                                            <Spinner color="green" />
                                        )}
                                        <Text style={styles.submitButtonText}>SUBMIT</Text>
                                    </Button>
                                </View>
                            </CardItem>
                        </Card>
                    ) : (
                            <View>
                                <Spinner color="red" />
                                <Text
                                    style={{
                                        textAlign: "center",
                                        color: "white",
                                        fontWeight: "bold"
                                    }}
                                >
                                    Loading
              </Text>
                            </View>
                        )}
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#1F2426"
    },
    title: {
        fontSize: 15,
        color: "#47BFB3",
        //marginRight: 80,
        marginTop: 10
    },
    picker: {
        marginLeft: 20,
        color: "white"
    },
    caretIcon: {
        right: 25
    },
    carditem: {
        backgroundColor: "#1F2426"
    },
    item: {
        marginBottom: 20,
        borderColor: "transparent"
    },
    label: {
        fontSize: 15,
        color: "#D94526"
    },
    input: {
        color: "white"
    },
    textArea: {
        width: "100%",
        color: "white"
    },
    cardFooter: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between"
    },
    buttonGroup: {
        backgroundColor: "#1F2426"
    },
    cancelText: {
        color: "white",
        fontSize: 20,
        fontWeight: "bold"
    },
    cancel: {
        // flex: 1,
        // flexDirection: "row",
        // justifyContent: "flex-start",
        marginTop: 10,
        marginLeft: 15
    },
    submitButton: {
        width: 150,
        justifyContent: "center"
    },
    submitButtonText: {
        fontSize: 20,
        fontWeight: "bold"
    },
    thumbnail: {
        width: 25,
        height: 25,
        marginTop: 5
    }
});

//multiselect style
const multiSelectStyles = StyleSheet.create({
    container: {
        backgroundColor: "#1F2426"
    },
    selectToggleText: { color: "white" },
    button: { backgroundColor: "#D94526" },
    searchBar: { backgroundColor: "#1F2426" },
    searchTextInput: { color: "#D94526" }
});
const color = {
    text: "#D94526",
    subText: "#47BFB3",
    searchPlaceholderTextColor: "#D94526",
    itemBackground: "#1F2426",
    subItemBackground: "#1F2426"
};
