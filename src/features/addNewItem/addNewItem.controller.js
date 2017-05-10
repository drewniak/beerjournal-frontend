/**
 * Created by wojciech_dymek on 22.04.17.
 */
export default function AddNewItemController($scope,$rootScope, $http, $location, $uibModal, toastr, countriesProvider) {
    let vm = this;
    vm.addNewItem = addNewItem;
    vm.countries = [];

    countriesProvider.getCountries().then(function(countries) {
        vm.countries = countries;
    });

    function addNewItem() {
        vm.item.ownerId = $rootScope.globals.currentUser.id;
        vm.item.attributes = [];

        $http.post('/api/users/' + vm.item.ownerId + "/collection/items", vm.item).then(function(res) {
            toastr.success('Item successfully added');

            var itemId = res.data.id;

            if (vm.imageFile != null) {
                $scope.form = [];
                 $http({
                  method  : 'POST',
                  url     : '/api/users/' + vm.item.ownerId + '/collection/items/'+ itemId + '/images',
                  processData: false,
                  transformRequest: function (data) {
                      var formData = new FormData();
                      formData.append("file", vm.imageFile);
                      return formData;  
                  },  
                  data : $scope.form,
                  headers: {
                         'Content-Type': undefined
              } 
           }).then(function(res){
                toastr.success('Image uploaded');
                $location.path("/collections")

           }, function (error) {
                toastr.success('Image upload error');
           });
       } else {
        $location.path("/collections")
       };
        }, function(res) {
            console.log(res);
            toastr.warning('Unable to add new item');
        })

    }

    var modalInstance;

    $scope.open = function () {
        modalInstance = $uibModal.open({
            templateUrl: '/fileSelector.html',
            scope: $scope,
            windowClass: 'small'

        });
    };

    $scope.uploadFiles = function (files, errFiles) {
        $scope.files = files;
        $scope.errFiles = errFiles;

        angular.forEach(files, function (file) {
            var reader = new FileReader();
            reader.onload =
                (function (theFile) {
                    return function (e) {
                        $scope.$apply(function () {
                            reader.result; //tresc pliku
                            //ro something with your file
                        });
                    };
                })(file);
        });
        modalInstance.close();
    };


    $scope.previewFile = function() {
        var preview = document.querySelector('img');
        var file    = document.querySelector('input[type=file]').files[0];
        var reader  = new FileReader();
        document.getElementById("fname").value ; //string file url
        reader.addEventListener("load", function () {
            preview.src = reader.result;
        }, false);

        if (file) {
            reader.readAsDataURL(file);
            vm.imageFile = file;
        }
    }

    $scope.breweryAutocomplete = function(searchText) {
        return $http
            .get('/api/categories/brewery/')
            .then(function(res) {
                return filterAutocompleteResults(searchText, res.data.values);
            });
    }

    $scope.typeAutocomplete = function(searchText) {
        return $http
            .get('/api/categories/type/')
            .then(function(res) {
                return filterAutocompleteResults(searchText, res.data.values);
            });
    }

    $scope.styleAutocomplete = function(searchText) {
        return $http
            .get('/api/categories/style/')
            .then(function(res) {
                return filterAutocompleteResults(searchText, res.data.values);
            });
    };

    function filterAutocompleteResults(searchText, results) {
        return results.filter(function(result) {
            return angular.lowercase(result).includes(angular.lowercase(searchText));
        });
    }

}