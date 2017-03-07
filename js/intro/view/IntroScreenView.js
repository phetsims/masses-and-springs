// Copyright 2017, University of Colorado Boulder

/**
 * ScreenView for the 'Intro' screen
 *
 * @author Matt Pennington
 * @author Denzell Barnett
 */
define( function( require ) {
  'use strict';

  // modules
  var ConstantsControlPanel = require( 'MASSES_AND_SPRINGS/intro/view/ConstantsControlPanel' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var OscillatingSpringNode = require( 'MASSES_AND_SPRINGS/common/view/OscillatingSpringNode' );
  var RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );
  var RangeWithValue = require( 'DOT/RangeWithValue' );
  var LinearFunction = require( 'DOT/LinearFunction' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Property = require( 'AXON/Property' );
  var Spring = require( 'MASSES_AND_SPRINGS/common/model/Spring' );
  var SpringLengthControlPanel = require( 'MASSES_AND_SPRINGS/intro/view/SpringLengthControlPanel' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var TwoSpringView = require( 'MASSES_AND_SPRINGS/common/view/TwoSpringView' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var IMAGE_SCALE = .3;

  // strings
  var constantString = require( 'string!MASSES_AND_SPRINGS/constant' );

  /**
   * @param {MassesAndSpringsModel} model
   * @param {Tandem} tandem
   * @constructor
   */
  function IntroScreenView( model, tandem ) {

    var self = this;

    // Calls common two spring view
    TwoSpringView.call( this, model, tandem );

    // Spring Constant Length Control Panel
    this.springLengthControlPanel = new SpringLengthControlPanel(
      model.springs[ 0 ].naturalRestingLengthProperty,
      new RangeWithValue( .1, .5, .3 ),
      StringUtils.format( 'Length 1', 1 ),
      tandem.createTandem( 'springLengthControlPanel' ),
      {
        right: this.springHangerNode.springHangerNode.left - 40,
        top: this.topSpacing,
        maxWidth: 125
      } );
    this.addChild( this.springLengthControlPanel );


    // @private panel that keeps thickness/spring constant at constant value
    this.constantsControlPanel = new ConstantsControlPanel(
      model.selectedConstantProperty,
      constantString,
      tandem.createTandem( 'constantsControlPanel' ),
      {
        minWidth: this.firstSpringConstantControlPanel.maxWidth,
        left: this.firstSpringConstantControlPanel.left,
        top: this.firstSpringConstantControlPanel.bottom + this.topSpacing
      }
    );
    this.addChild( this.constantsControlPanel );

    // initial parameters set for both scenes
    // @private {read-write} array of parameters for scene 1
    var scene1Parameters = model.stashSceneParameters();

    // @private {read-write} array of parameters for scene 2
    model.springs[ 0 ].naturalRestingLengthProperty.set( MassesAndSpringsConstants.DEFAULT_SPRING_LENGTH / 2 );
    var scene2Parameters = model.stashSceneParameters();

    model.springs[ 0 ].naturalRestingLengthProperty.set( MassesAndSpringsConstants.DEFAULT_SPRING_LENGTH );

    // Link that is responsible for switching the scenes
    model.springLengthModeProperty.lazyLink( function( mode ) {

      /**@private Functions used to determine the inverse relationship between the length and springConstant/thickness
       Functions follow logic:
       -SpringConstant = constant --> As length increases, spring thickness decreases (and vice versa)
       -Thickness = constant -->As length increases, spring constant decreases  (and vice versa)
       */
      var mapRestingLengthToSpringConstant = new LinearFunction( .1, .5, 2.5, 5.5 );
      var mapRestingLengthToThickness = new LinearFunction( .1, .5, 5, 15 );
      var mapRestingLengthToThickness2 = new LinearFunction( .1, .5, self.firstOscillatingSpringNode.lineWidthProperty.get(), self.firstOscillatingSpringNode.lineWidthProperty.get() );

      self.resetMassLayer();

      // Reset springs when scenes are switched
      if ( mode === 'same-length' ) {

        // model.springPropertyUpdate(model.springs[ 0 ].naturalRestingLengthProperty );
        // Manages stashing and applying parameters to each scene
        scene2Parameters = model.stashSceneParameters();
        model.applySceneParameters( scene1Parameters );
        self.springLengthControlPanel.visible = false;
      }

      else if ( mode === 'adjustable-length' ) {
        // Manages stashing and applying parameters to each scene
        scene1Parameters = model.stashSceneParameters();
        model.applySceneParameters( scene2Parameters );
        self.springLengthControlPanel.visible = true;

        // Manages logic for handling spring constants
        self.firstOscillatingSpringNode.lineWidthProperty.set( self.secondOscillatingSpringNode.lineWidthProperty.get() );
        Property.multilink( [ model.selectedConstantProperty, model.springs[ 0 ].naturalRestingLengthProperty ], function() {
          {
            if ( model.selectedConstantProperty.get() === 'spring-constant' ) {
              // model.springPropertyUpdate(model.springs[0].springConstantProperty);
              // TODO: Sloppy implementation. See https://github.com/phetsims/masses-and-springs/issues/34
              var tempSpringConstant = model.springs[ 0 ].springConstantProperty.get();
              model.springs[ 0 ].springConstantProperty.set( model.springs[ 0 ].springConstantProperty.get() * .99 );
              model.springs[ 0 ].springConstantProperty.set( tempSpringConstant );
              self.firstOscillatingSpringNode.lineWidthProperty.set( mapRestingLengthToSpringConstant( model.springs[ 0 ].naturalRestingLengthProperty.get() ) );
            }
            else if ( model.selectedConstantProperty.get() === 'spring-thickness' ) {
              // model.springPropertyUpdate(model.springs[0].thicknessProperty);
              model.springs[ 0 ].springConstantProperty.set( mapRestingLengthToThickness( model.springs[ 0 ].naturalRestingLengthProperty.get() ) );
              self.firstOscillatingSpringNode.lineWidthProperty.set( mapRestingLengthToThickness2( model.springs[ 0 ].naturalRestingLengthProperty.get() ) );
            }
          }
        } );
      }
      Property.multilink( [ model.selectedConstantProperty, self.firstOscillatingSpringNode.lineWidthProperty ], function() {

        var property = [ model.springs[ 0 ].springConstantProperty.get(), self.firstOscillatingSpringNode.lineWidthProperty.get() ];
        console.log( 'springConstant = ' + property[ 0 ] + '\t\t' + 'thickness = ' + self.firstOscillatingSpringNode.lineWidthProperty.get() );
      } );

      // Manages visibility of panels for spring length, spring constant, and thickness
      self.constantsControlPanel.visible = self.springLengthControlPanel.visible;
      self.firstSpringConstantControlPanel.visible = !self.springLengthControlPanel.visible;
      self.secondSpringConstantControlPanel.visible = !self.springLengthControlPanel.visible;
    } );

    // @public {read-only} Springs created to be used in the icons for the scene selection tabs
    this.springsIcon = [
      new Spring( new Vector2( .65, model.ceilingY ), MassesAndSpringsConstants.DEFAULT_SPRING_LENGTH, new RangeWithValue( 5, 15, 9 ), 0, tandem.createTandem( 'firstIconSpring' ) ),
      new Spring( new Vector2( .85, model.ceilingY ), MassesAndSpringsConstants.DEFAULT_SPRING_LENGTH, new RangeWithValue( 5, 15, 9 ), 0, tandem.createTandem( 'secondIconSpring' ) ),
      new Spring( new Vector2( .65, model.ceilingY + .17 ), MassesAndSpringsConstants.DEFAULT_SPRING_LENGTH, new RangeWithValue( 5, 15, 9 ), 0, tandem.createTandem( 'thirdIconSpring' ) )
    ];

    // @private {read-only} Creation of spring for use in scene switching icons
    var firstSpringIcon = new OscillatingSpringNode( this.springsIcon[ 0 ], this.mvt );
    firstSpringIcon.loopsProperty.set( 10 );
    firstSpringIcon.lineWidthProperty.set( 3 );

    // @private {read-only} Creation of spring for use in scene switching icons
    var secondSpringIcon = new OscillatingSpringNode( this.springsIcon[ 1 ], this.mvt );
    secondSpringIcon.loopsProperty.set( 10 );
    secondSpringIcon.lineWidthProperty.set( 3 );

    // @private {read-only} Creation of spring for use in scene switching icons
    var thirdSpringIcon = new OscillatingSpringNode( this.springsIcon[ 2 ], this.mvt );
    thirdSpringIcon.loopsProperty.set( 5 );
    thirdSpringIcon.lineWidthProperty.set( 3 );

    // @private {read-only} White background for scene switching icons
    var iconBackground = new Rectangle( firstSpringIcon.x - 40, 25, 160, 190, 2, 2, { fill: 'white' } );

    // @private {read-only} Creation of same length icon node
    var sameLengthIcon = new Node( { scale: IMAGE_SCALE } );
    sameLengthIcon.addChild( iconBackground );
    sameLengthIcon.addChild( firstSpringIcon );
    sameLengthIcon.addChild( secondSpringIcon );

    // @private {read-only} Creation of adjustable length icon node
    var differentLengthIcon = new Node( { scale: IMAGE_SCALE } );
    differentLengthIcon.addChild( iconBackground );
    differentLengthIcon.addChild( thirdSpringIcon );
    differentLengthIcon.addChild( secondSpringIcon );

    // @private {read-only} Creation of toggled modes for scene selection
    var toggleButtonsContent = [ {
      value: 'same-length',
      node: sameLengthIcon
    }, {
      value: 'adjustable-length',
      node: differentLengthIcon
    } ];

    // @private {read-only} Creation of icons for scene selection
    var sceneRadioButtonGroup = new RadioButtonGroup( model.springLengthModeProperty, toggleButtonsContent, {
      buttonContentXMargin: 4,
      buttonContentYMargin: 4,
      top: this.toolboxPanel.bottom + 55,
      right: this.gravityControlPanel.right,
      baseColor: 'black',
      selectedStroke: 'yellow',
      deselectedStroke: 'yellow',
      selectedLineWidth: 1.3,
      deselectedLineWidth: 0.6,
      orientation: 'horizontal',
      spacing: 13
    } );
    this.addChild( sceneRadioButtonGroup );
    sceneRadioButtonGroup.moveToBack();
  }

  massesAndSprings.register( 'IntroScreenView', IntroScreenView );

  return inherit( TwoSpringView, IntroScreenView );
} );