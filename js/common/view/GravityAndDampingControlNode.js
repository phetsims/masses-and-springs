// Copyright 2017-2018, University of Colorado Boulder

/**
 * Node for the gravity control panel and combo box for planet gravity options.
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var Body = require( 'MASSES_AND_SPRINGS/common/model/Body' );
  var ComboBox = require( 'SUN/ComboBox' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var HSlider = require( 'SUN/HSlider' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MathSymbols = require( 'SCENERY_PHET/MathSymbols' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  var Node = require( 'SCENERY/nodes/Node' );
  var NumberControl = require( 'SCENERY_PHET/NumberControl' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );
  var Vector2 = require( 'DOT/Vector2' );

  // strings
  var dampingString = require( 'string!MASSES_AND_SPRINGS/damping' );
  var dampingEqualsZeroString = require( 'string!MASSES_AND_SPRINGS/dampingEqualsZero' );
  var lotsString = require( 'string!MASSES_AND_SPRINGS/lots' );
  var noneString = require( 'string!MASSES_AND_SPRINGS/none' );
  var gravityString = require( 'string!MASSES_AND_SPRINGS/gravity' );
  var gravityValueString = require( 'string!MASSES_AND_SPRINGS/gravityValue' );
  var whatIsTheValueOfGravityString = require( 'string!MASSES_AND_SPRINGS/whatIsTheValueOfGravity' );

  // constants
  var SPACING = 7;
  var TITLE_INDENT = -35;
  var MAX_WIDTH = 80;

  /**
   * @param {MassesAndSpringsModel} model
   * @param {Node} listNodeParent
   * @param {Tandem} tandem
   * @param {Object} [options]
   *
   * @constructor
   */
  function GravityAndDampingControlNode( model, listNodeParent, tandem, options ) {
    options = _.extend( {
      dampingVisible: false,
      hSlider: false
    }, options );

    //  Add gravity info for various planets
    var bodyListItems = [];
    var bodies = Body.BODIES;
    Body.BODIES.forEach( function( body ) {
      var bodyLabel = new Text( body.title, {
        font: MassesAndSpringsConstants.LABEL_FONT,
        maxWidth: MAX_WIDTH,
        tandem: tandem.createTandem( 'bodyLabel' )
      } );
      bodyLabel.localBounds = bodyLabel.localBounds.withX( 50 );

      bodyListItems.push( {
        node: bodyLabel,
        value: body
      } );
    } );
    var gravityProperty = model.gravityProperty;

    var sliderOptions = {
      majorTickLength: 5,
      minorTickLength: 5,
      titleFont: new PhetFont( { size: 14, weight: 'bold' } ),
      trackSize: new Dimension2( 120, 0.1 ),
      thumbSize: new Dimension2( 13, 24 ),
      thumbFillEnabled: '#00C4DF',
      thumbFillHighlighted: MassesAndSpringsConstants.THUMB_HIGHLIGHT,
      visible: true,
      align: 'left',
      stroke: null,
      sliderIndent: 7,
      constrainValue: function( value ) {
        value = Util.roundSymmetric( value * 100 / 3 ) * 3;
        return value / 100;
      }
    };

    var gravitySliderOptions = {
      left: TITLE_INDENT,
      xMargin: 0,
      majorTickLength: 10,
      titleFont: new PhetFont( { size: 14, weight: 'bold' } ),
      titleMaxWidth: MAX_WIDTH ,
      trackSize: new Dimension2( 125, 0.1 ),
      thumbSize: new Dimension2( 13, 24 ),
      thumbFillEnabled: '#00C4DF',
      thumbFillHighlighted: MassesAndSpringsConstants.THUMB_HIGHLIGHT,
      stroke: null,
      sliderIndent: 7,
      majorTicks: [
        {
          value: MassesAndSpringsConstants.GRAVITY_RANGE.min,
          label: new Text( String( MassesAndSpringsConstants.GRAVITY_RANGE.min ), {
            font: MassesAndSpringsConstants.LABEL_FONT
          } )
        },
        {
          value: MassesAndSpringsConstants.GRAVITY_RANGE.max,
          label: new Text( String( MassesAndSpringsConstants.GRAVITY_RANGE.max ), {
            font: MassesAndSpringsConstants.LABEL_FONT
          } )
        }
      ],
      layoutFunction: NumberControl.createLayoutFunction1( {
        titleXSpacing: 55,
        ySpacing: 2,
        arrowButtonsXSpacing: 1
      } ),
      valuePattern: StringUtils.fillIn( gravityValueString, {
        gravity: '{0}'
      } ),
      valueFont: new PhetFont( { size: 14 } ),
      useRichText: true,
      decimalPlaces: 1,
      valueMaxWidth: MAX_WIDTH * 2,
      delta: 0.1,
      arrowButtonScale: 0.5
    };

    // Create title for gravity slider
    var gravitySliderTitle = new Text( gravityString, {
      font: new PhetFont( { size: 14, weight: 'bold' } ),
      maxWidth: MAX_WIDTH
    } );

    if ( options.hSlider ) {

      // Create gravity slider
      var gravitySlider = new HSlider( model.gravityProperty, MassesAndSpringsConstants.GRAVITY_RANGE, sliderOptions );
      gravitySlider.addMajorTick( MassesAndSpringsConstants.GRAVITY_RANGE.min, new Text( noneString, {
        font: MassesAndSpringsConstants.LABEL_FONT,
        tandem: tandem.createTandem( 'gravityNoneString' ),
        maxWidth: MAX_WIDTH
      } ) );
      gravitySlider.addMajorTick( MassesAndSpringsConstants.GRAVITY_RANGE.max, new Text( lotsString, {
        font: MassesAndSpringsConstants.LABEL_FONT,
        tandem: tandem.createTandem( 'gravityLotsString' ),
        maxWidth: MAX_WIDTH
      } ) );

      gravitySlider.left = gravitySliderTitle.centerX - 10;
      gravitySlider.top = gravitySliderTitle.bottom + SPACING;
    }
    else {
      gravitySlider = new NumberControl(
        gravityString,
        model.gravityProperty,
        MassesAndSpringsConstants.GRAVITY_RANGE,
        gravitySliderOptions
      );
    }

    // Manages the values associated with the gravity panel in a combo box
    var questionTextNode = new Node( {
      children: [ new Text( whatIsTheValueOfGravityString, {
        font: MassesAndSpringsConstants.TITLE_FONT,
        maxWidth: MAX_WIDTH * 3
      } )
      ],
      yMargin: 20,
      center: gravitySlider.center
    } );

    // Manages the items associated with the gravity panel in a combo box
    var gravityComboBox = new ComboBox( bodyListItems, model.bodyProperty, listNodeParent, {
      top: gravitySlider.bottom + SPACING,
      centerX: gravitySlider.centerX + 15,
      buttonCornerRadius: 3,
      buttonYMargin: 0,
      itemYMargin: 3,
      itemXMargin: 2,
      listYMargin: 3,
      tandem: tandem.createTandem( 'gravityComboBox' )
    } );

    if ( options.dampingVisible ) {

      // Creating title for damping hSlider
      var dampingHSliderTitle = new Text( dampingString, {
        font: new PhetFont( { size: 14, weight: 'bold' } ),
        maxWidth: MAX_WIDTH ,
        top: gravityComboBox.bottom + SPACING,
        left: TITLE_INDENT
      } );

      // {Range} Range for hSlider
      var dampingRange = MassesAndSpringsConstants.DAMPING_RANGE;

      // Creating damping hSlider
      var dampingHSlider = new HSlider( model.dampingProperty, dampingRange, {
        top: dampingHSliderTitle.bottom + SPACING * 3,
        left: dampingHSliderTitle.centerX,
        majorTickLength: 10,
        minorTickLength: 5,
        minorTickLineWidth: 0.5,
        trackSize: new Dimension2( 120, 0.1 ),
        thumbSize: new Dimension2( 13, 22 ),
        thumbFillEnabled: '#00C4DF',
        thumbFillHighlighted: MassesAndSpringsConstants.THUMB_HIGHLIGHT,
        align: 'center',
        constrainValue: function( value ) {
          value = Util.roundSymmetric( value * 100 / 5.75 ) * 5.75;
          return value / 100;
        },
        tandem: tandem.createTandem( 'hSlider' )
      } );

      dampingHSlider.addMajorTick( dampingRange.min, new Text( noneString, {
        font: MassesAndSpringsConstants.LABEL_FONT,
        maxWidth: MAX_WIDTH
      } ) );
      dampingHSlider.addMajorTick( dampingRange.min + ( dampingRange.max - dampingRange.min ) / 2 );
      dampingHSlider.addMajorTick( dampingRange.max, new Text( lotsString, {
        font: MassesAndSpringsConstants.LABEL_FONT,
        maxWidth: MAX_WIDTH
      } ) );
      for ( var i = 1; i < 6; i++ ) {
        if ( i !== 3 ) {
          dampingHSlider.addMinorTick( dampingRange.min + i * ( dampingRange.max - dampingRange.min ) / 6 );
        }
      }

      // Created so we can swap visibility of the questionTextNode and the gravitySlider for Planet X
      var gravityNode = new Node( { children: [ questionTextNode, gravitySlider ] } );
      var contentNode = new Node( {
        children: [
          gravitySliderTitle,
          gravityNode,
          gravityComboBox,
          dampingHSliderTitle,
          dampingHSlider
        ],
        tandem: tandem.createTandem( 'gravityPropertyVBox' )
      } );

      // Content to be added to parent node
      Node.call( this, { children: [ contentNode ] } );

      // Alignment of Node contents for panel with damping
      if ( gravitySlider instanceof NumberControl ) {
        gravitySliderTitle.leftTop = new Vector2( this.left, this.top + 23.5 );
        gravitySlider.centerX = this.centerX;
        gravitySlider.left = this.left;
        gravitySlider.top = this.top + 7;
        questionTextNode.centerX = this.centerX;
      }
      else {
        gravitySliderTitle.top = this.top + 16;
        gravitySliderTitle.centerX = this.centerX - 72;
        gravitySliderTitle.top = this.top - 12.5;
        gravitySlider.centerX = this.centerX;
        questionTextNode.centerX = gravitySlider.centerX - 5;
        questionTextNode.top = this.top - 12;
        gravityComboBox.top = gravitySlider.bottom + 10;

      }
      questionTextNode.top = gravitySlider.bottom - 30;
      gravityComboBox.centerX = gravitySlider.centerX;
      gravityComboBox.top = gravitySlider.bottom + 10;
      dampingHSliderTitle.left = gravitySliderTitle.left;
      dampingHSliderTitle.top = gravityComboBox.bottom + 10;
      dampingHSlider.centerX = gravitySlider.centerX;
      dampingHSlider.top = dampingHSliderTitle.bottom + 5;
    }
    else {

      // Creating text that reads Damping = 0
      var dampingEqualsZeroText = new Text( StringUtils.fillIn( dampingEqualsZeroString, {
        equalsZero: MathSymbols.EQUAL_TO + ' 0'
      } ), {
        font: MassesAndSpringsConstants.TITLE_FONT,
        maxWidth: MAX_WIDTH * 2,
        top: gravityComboBox.bottom + SPACING,
        centerX: gravityComboBox.centerX
      } );
      gravityNode = new Node( { children: [ questionTextNode, gravitySlider ] } );

      // Content to be added to parent node
      contentNode = new Node( {
        children: [
          gravitySliderTitle,
          gravityNode,
          gravityComboBox,
          dampingEqualsZeroText
        ],
        tandem: tandem.createTandem( 'gravityPropertyVBox' )
      } );
      Node.call( this, { children: [ contentNode ] } );

      // Alignment of Node contents for panel without damping
      gravitySliderTitle.centerX = this.centerX - 80;
      gravitySliderTitle.top = this.top + 3.5;
      gravitySlider.centerX = this.centerX;
      questionTextNode.centerX = gravitySlider.centerX - 5;
      questionTextNode.top = gravitySlider.bottom - 30;
      gravityComboBox.centerX = gravitySlider.centerX;
      gravityComboBox.top = gravitySlider.bottom + 10;
      dampingEqualsZeroText.top = gravityComboBox.bottom + 10;
      dampingEqualsZeroText.left = gravitySliderTitle.left;
    }

    // Responsible for managing bodies and question text visibility
    model.bodyProperty.link( function( newBody ) {
      var body = _.find( bodies, newBody );

      // Unhide the gravitySlider if we are not using planetX
      if ( newBody !== Body.PLANET_X ) {
        questionTextNode.visible = false;
        gravitySlider.visible = !questionTextNode.visible;
      }

      // If PlanetX hide the slider and update gravity
      else {
        questionTextNode.visible = true;
        gravitySlider.visible = !questionTextNode.visible;
      }
      gravityProperty.set( body.gravity );
    } );

    gravityProperty.link( function( newGravity, oldGravity ) {

      // If the user manually changed the gravity then change the body to CUSTOM.
      var selectedBody = model.bodyProperty.get();
      if ( selectedBody !== Body.CUSTOM && selectedBody.gravity !== newGravity ) {

        //  Since the current gravity didn't match any existing bodies, the user must have set gravity manually.
        model.bodyProperty.set( Body.CUSTOM );
      }
      if(newGravity===Body.PLANET_X.gravity){

        // Prevents viewing PLANET_X gravity after switching from planet X to custom.
        Body.CUSTOM.gravity= oldGravity;
      }
    } );
    this.mutate( options );
  }

  massesAndSprings.register( 'GravityAndDampingControlNode', GravityAndDampingControlNode );

  return inherit( Node, GravityAndDampingControlNode );
} );