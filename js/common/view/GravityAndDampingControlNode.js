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
  var HStrut = require( 'SCENERY/nodes/HStrut' );
  var VStrut = require( 'SCENERY/nodes/VStrut' );
  var inherit = require( 'PHET_CORE/inherit' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  var MassesAndSpringsModel = require( 'MASSES_AND_SPRINGS/common/model/MassesAndSpringsModel' );
  var Node = require( 'SCENERY/nodes/Node' );
  var NumberControl = require( 'SCENERY_PHET/NumberControl' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var HBox = require( 'SCENERY/nodes/HBox' );

  // strings
  var dampingString = require( 'string!MASSES_AND_SPRINGS/damping' );
  var dampingEqualsZeroString = require( 'string!MASSES_AND_SPRINGS/dampingEqualsZero' );
  var lotsString = require( 'string!MASSES_AND_SPRINGS/lots' );
  var noneString = require( 'string!MASSES_AND_SPRINGS/none' );
  var gravityString = require( 'string!MASSES_AND_SPRINGS/gravity' );
  var gravityValueString = require( 'string!MASSES_AND_SPRINGS/gravityValue' );
  var whatIsTheValueOfGravityString = require( 'string!MASSES_AND_SPRINGS/whatIsTheValueOfGravity' );

  // constants
  var TITLE_OFFSET = 125;

  /**
   * @param {MassesAndSpringsModel} model
   * @param {Node} listNodeParent
   * @param {Tandem} tandem
   * @param {Object} [options]
   *
   * @constructor
   */
  function GravityAndDampingControlNode( model, listNodeParent, tandem, options ) {
    var self = this;
    options = _.extend( {
      dampingVisible: false,
      hSlider: false
    }, options );

    //  Add gravity info for various planets
    var bodyListItems = [];
    this.bodies = MassesAndSpringsModel.BODIES;
    MassesAndSpringsModel.BODIES.forEach( function( body ) {
      var bodyLabel = new Text( body.title, {
        font: MassesAndSpringsConstants.LABEL_FONT,
        tandem: tandem.createTandem( 'bodyLabel' )
      } );
      bodyLabel.localBounds = bodyLabel.localBounds.withMaxX( Math.max( 50, bodyLabel.localBounds.maxX ) );

      bodyListItems.push( {
        node: bodyLabel,
        value: body
      } );
    } );

    // @public
    this.gravityProperty = model.gravityProperty;

    // @public
    this.bodyProperty = model.bodyProperty;

    // @private {read-only} manages the items associated with the gravity panel in a combo box
    var gravityComboBox = new ComboBox( bodyListItems, model.bodyProperty, listNodeParent, {
      buttonCornerRadius: 3,
      buttonYMargin: 0,
      itemYMargin: 5,
      itemXMargin: 2,
      listYMargin: 3,
      tandem: tandem.createTandem( 'gravityComboBox' )
    } );

    var sliderOptions = {
      majorTickLength: 5,
      minorTickLength: 5,
      titleFont: new PhetFont( { size: 14, weight: 'bold' } ),
      trackSize: new Dimension2( 120, 0.1 ),
      thumbSize: new Dimension2( 13, 24 ),
      thumbFillEnabled: '#00C4DF',
      thumbFillHighlighted: '#71EDFF',
      visible: true,
      align: 'left',
      stroke: null,
      sliderIndent: 7,
      constrainValue: function( value ) {
        value = Math.round( value * 100 / 3 ) * 3;
        return value / 100;
      }
    };

    var gravitySliderOptions = {
      majorTickLength: 5,
      titleFont: new PhetFont( { size: 14, weight: 'bold' } ),
      trackSize: new Dimension2( 125, 0.1 ),
      thumbSize: new Dimension2( 13, 24 ),
      thumbFillEnabled: '#00C4DF',
      thumbFillHighlighted: '#71EDFF',
      stroke: null,
      sliderIndent: 7,
      majorTicks: [
        {
          value: MassesAndSpringsConstants.GRAVITY_RANGE_PROPERTY.value.min,
          label: new Text( String( MassesAndSpringsConstants.GRAVITY_RANGE_PROPERTY.value.min ), { font: MassesAndSpringsConstants.LABEL_FONT } )
        },
        {
          value: MassesAndSpringsConstants.GRAVITY_RANGE_PROPERTY.value.max,
          label: new Text( String( MassesAndSpringsConstants.GRAVITY_RANGE_PROPERTY.value.max ), { font: MassesAndSpringsConstants.LABEL_FONT } )
        }
      ],
      layoutFunction: NumberControl.createLayoutFunction1( {
        titleXSpacing: 70,
        ySpacing: 2,
        arrowButtonsXSpacing: 1
      } ),
      valuePattern: StringUtils.fillIn( gravityValueString, {
        gravity: '{0}'
      } ),
      useRichText: true,
      decimalPlaces: 1,
      delta: 0.1,
      arrowButtonScale: 0.5
    };

    var questionTextOffset = 20;
    if ( options.hSlider ) {

      var gravityHSliderTitle = new HBox( {
        align: 'left',
        children: [
          new Text( gravityString, { font: new PhetFont( { size: 14, weight: 'bold' } ) } ),
          new HStrut( TITLE_OFFSET + 3 )
        ]
      } );

      var gravityHSlider = new HSlider( model.gravityProperty, MassesAndSpringsConstants.GRAVITY_RANGE_PROPERTY.get(), sliderOptions );
      gravityHSlider.addMajorTick( MassesAndSpringsConstants.GRAVITY_RANGE_PROPERTY.get().min, new Text( noneString, {
        font: MassesAndSpringsConstants.LABEL_FONT,
        tandem: tandem.createTandem( 'gravityNoneString' )
      } ) );
      gravityHSlider.addMajorTick( MassesAndSpringsConstants.GRAVITY_RANGE_PROPERTY.get().max, new Text( lotsString, {
        font: MassesAndSpringsConstants.LABEL_FONT,
        tandem: tandem.createTandem( 'gravityLotsString' )
      } ) );

      var gravitySlider = new VBox( {
        align: 'left',
        spacing: 2,
        children: [ gravityHSliderTitle, new HBox( { children: [ new HStrut( 15 ), gravityHSlider ] } ) ]
      } );
    }
    else {
      gravitySlider = new NumberControl( gravityString, model.gravityProperty, MassesAndSpringsConstants.GRAVITY_RANGE_PROPERTY.value, gravitySliderOptions );
      questionTextOffset = 23.5;
    }

    // Manages the values associated with the gravity panel in a combo box
    var questionTextNode = new VBox( {
      children:
        [
          // TODO: Can we match the bounds of the questionText to the gravitySlider so the panel doesn't change size
          new VStrut( questionTextOffset ),
          new Text( whatIsTheValueOfGravityString, {
            font: MassesAndSpringsConstants.TITLE_FONT,
            maxWidth: this.maxWidth
          } ),
          new VStrut( questionTextOffset )
        ]
    } );
    questionTextNode.bounds.set( gravitySlider.bounds );

    if ( options.dampingVisible ) {
      var dampingRange = MassesAndSpringsConstants.DAMPING_RANGE_PROPERTY.get();
      var dampingHSlider = new HSlider( model.dampingProperty, dampingRange, {
        majorTickLength: 10,
        minorTickLength: 5,
        minorTickLineWidth: 0.5,
        trackSize: new Dimension2( 120, 0.1 ),
        thumbSize: new Dimension2( 13, 22 ),
        thumbFillEnabled: '#00C4DF',
        thumbFillHighlighted: '#71EDFF',
        align: 'center',
        constrainValue: function( value ) {
          value = Math.round( value * 100 / 3 ) * 3;
          return value / 100;
        },
        tandem: tandem.createTandem( 'hSlider' )
      } );

      dampingHSlider.addMajorTick( dampingRange.min, new Text( noneString, { font: MassesAndSpringsConstants.LABEL_FONT } ) );
      dampingHSlider.addMajorTick( dampingRange.min + ( dampingRange.max - dampingRange.min ) / 2 );
      dampingHSlider.addMajorTick( dampingRange.max, new Text( lotsString, { font: MassesAndSpringsConstants.LABEL_FONT } ) );
      for ( var i = 1; i < 10; i++ ) {
        if ( i !== 5 ) {
          dampingHSlider.addMinorTick( dampingRange.min + i * ( dampingRange.max - dampingRange.min ) / 10 );
        }
      }

      var dampingHSliderTitle = new HBox( {
        align: 'left',
        children: [
          new Text( dampingString, { font: new PhetFont( { size: 14, weight: 'bold' } ) } ),
          new HStrut( TITLE_OFFSET - 7 )
        ]
      } );

      var contentVBox = new VBox( {
        align: 'center',
        spacing: 8,
        children: [
          questionTextNode,
          gravityComboBox,
          dampingHSliderTitle,
          dampingHSlider
        ],
        tandem: tandem.createTandem( 'gravityPropertyVBox' )
      } );
      Node.call( this, { children: [ contentVBox ] } );
    }
    else {

      var dampingEqualsZeroText = new HBox( {
        align: 'left',
        children: [
          new Text( dampingEqualsZeroString, {
            font: MassesAndSpringsConstants.TITLE_FONT,
            maxWidth: this.maxWidth
          } ),
          new HStrut( TITLE_OFFSET - 35 )
        ]
      } );

      contentVBox = new VBox( {
        align: 'center',
        spacing: 8,
        children: [
          questionTextNode,
          gravityComboBox,
          new VStrut( 2 ),
          dampingEqualsZeroText
        ],
        tandem: tandem.createTandem( 'gravityPropertyVBox' )
      } );
      Node.call( this, { children: [ contentVBox ] } );
    }

    model.bodyProperty.link( function( newBody, previousBody ) {
      var body = _.find( self.bodies, newBody );

      // Unhide the gravitySlider if we are not using planetX
      if ( newBody !== Body.PLANET_X ) {

        // Removes the questionTextNode and replaces it with a gravity slider
        contentVBox.removeChild( contentVBox.children[ 0 ] );
        contentVBox.insertChild( 0, gravitySlider );
      }

      // If PlanetX hide the slider and update gravity
      if ( newBody === Body.PLANET_X ) {

        // Removes the gravity slider and replaces it with a questionTextNode
        contentVBox.removeChild( contentVBox.children[ 0 ] );
        contentVBox.insertChild( 0, questionTextNode );

        self.gravityProperty.set( body.gravity );

      }

      //  If we switched from PlanetX to Custom, display the last known non-planetX gravity.
      else if ( previousBody === Body.PLANET_X && newBody === Body.CUSTOM ) {
        self.gravityProperty.set( previousBody.gravity );
      }

      // Update gravity
      else if ( body.gravity || body === Body.ZERO_G ) {
        self.gravityProperty.set( body.gravity );
      }
    } );

    this.gravityProperty.link( function( newGravity ) {

      // If the user manually changed the gravity then change the body to CUSTOM.
      var selectedBody = model.bodyProperty.get();
      if ( selectedBody !== Body.CUSTOM && selectedBody.gravity !== newGravity ) {

        //  Since the current gravity didn't match any existing bodies, the user must have set gravity manually.
        model.bodyProperty.set( Body.CUSTOM );
      }
    } );
    this.mutate( options );
  }

  massesAndSprings.register( 'GravityAndDampingControlNode', GravityAndDampingControlNode );

  return inherit( Node, GravityAndDampingControlNode );
} );
